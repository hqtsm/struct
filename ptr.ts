/**
 * @module
 *
 * Pointer types and factory.
 */

import { MeekValueMap } from '@hqtsm/meek/valuemap';
import { Endian } from './endian.ts';
import type { MemberInfo, MemberInfos, Members } from './members.ts';
import type { ArrayBufferReal } from './native.ts';
import type { Type, TypeConstructor } from './type.ts';
import { assignType, constant } from './util.ts';

function index(key: PropertyKey): number | null {
	let i;
	return key === '-0' ? NaN : (key === '' + (i = +String(key)) ? i : null);
}

const handler: ProxyHandler<Ptr<unknown>> = {
	deleteProperty(target, key): boolean {
		let i;
		return Reflect.has(target, key) || (i = index(key)) === null
			? Reflect.deleteProperty(target, key)
			: !(i === i - i % 1);
	},
	get(target, key, receiver: Ptr<unknown>): unknown | undefined {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.get(target, key);
		}
		if ((i === i - i % 1)) {
			return receiver.get(i);
		}
	},
	has(target, key): boolean {
		let i;
		return (
			Reflect.has(target, key) ||
			((i = index(key)) !== null && i === i - i % 1)
		);
	},
	set(target, key, value, receiver: Ptr<unknown>): boolean {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.set(target, key, value);
		}
		if (i === i - i % 1) {
			receiver.set(i, value);
		}
		return true;
	},
};

function memberGet(
	bpe: number,
	target: Readonly<MemberInfos>,
	key: string | symbol,
): Readonly<MemberInfo> | undefined {
	const i = index(key);
	if (i === null) {
		return Reflect.get(target, key);
	}
	if (i === i - i % 1) {
		return {
			byteLength: bpe,
			byteOffset: i * bpe,
		};
	}
}

function memberHas(
	target: Readonly<MemberInfos>,
	key: string | symbol,
): boolean {
	return index(key) === null ? Reflect.has(target, key) : true;
}

function memberSet(
	target: Readonly<MemberInfos>,
	key: string | symbol,
	value: unknown,
	receiver: Readonly<MemberInfos>,
): boolean {
	return index(key) === null
		? Reflect.set(target, key, value, receiver)
		: false;
}

let members: WeakMap<typeof Ptr, MemberInfos>;

/**
 * Pointer to a type.
 */
export class Ptr<T = never> extends Endian implements Members {
	/**
	 * Ptr class.
	 */
	declare public readonly ['constructor']: PtrClass<Ptr<T>>;

	/**
	 * Pointer elements.
	 */
	[index: number]: T;

	/**
	 * Create instance for buffer.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		super(buffer, byteOffset, littleEndian);
		return new Proxy(this, handler as ProxyHandler<Ptr<T>>);
	}

	/**
	 * Get accessor.
	 *
	 * @param index Pointer index.
	 * @returns Pointer value.
	 */
	public get(index: number): T {
		index = (+index || 0) - (index % 1 || 0);
		throw new TypeError(`Read from void pointer: ${index}`);
	}

	/**
	 * Set accessor.
	 *
	 * @param index Pointer index.
	 * @param value Pointer value.
	 */
	public set(index: number, value: T): void {
		index = (+index || 0) - (index % 1 || 0);
		void value;
		throw new TypeError(`Write to void pointer: ${index}`);
	}

	/**
	 * Size of each element.
	 */
	public static readonly BYTES_PER_ELEMENT: number = 0;

	/**
	 * Non-overlapping members.
	 */
	public static readonly OVERLAPPING: boolean = false;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): MemberInfos {
		let r = (members ??= new WeakMap()).get(this);
		if (!r) {
			members.set(
				this,
				r = new Proxy(
					Object.create(
						Object.getPrototypeOf(this).MEMBERS ?? null,
					) as MemberInfos,
					{
						get: memberGet.bind(null, this.BYTES_PER_ELEMENT),
						has: memberHas,
						set: memberSet,
					},
				),
			);
			members.set(this, r);
		}
		return r;
	}

	static {
		constant(this.prototype, Symbol.toStringTag, 'Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
		constant(this, 'OVERLAPPING');
	}
}

/**
 * Pointer class.
 */
export interface PtrClass<T extends Ptr<unknown> = Ptr>
	extends Omit<typeof Ptr, 'new'> {
	/**
	 * Ptr prototype.
	 */
	readonly prototype: T;
}

/**
 * Pointer constructor.
 */
export interface PtrConstructor<T extends Ptr<unknown> = Ptr>
	extends PtrClass<T> {
	/**
	 * Ptr constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		littleEndian?: boolean | null,
	): T;
}

let pointers: WeakMap<TypeConstructor<Type>, PtrConstructor<Ptr<Type>>>;

/**
 * Get pointer of type.
 *
 * @param Type Type constructor.
 * @returns Ptr constructor.
 */
export function pointer<T extends Type>(
	Type: TypeConstructor<T>,
): PtrConstructor<Ptr<T>> {
	let r = (pointers ??= new WeakMap()).get(Type) as
		| PtrConstructor<Ptr<T>>
		| undefined;
	if (!r) {
		const name = `${Ptr.name}<${Type.name}>`;
		const bpe = Type.BYTE_LENGTH;
		pointers.set(
			Type,
			r = {
				[name]: class extends Ptr<T> {
					declare public readonly ['constructor']: PtrClass<Ptr<T>>;

					readonly #values = new MeekValueMap<number, T>();

					public override get(index: number): T {
						index = (+index || 0) - (index % 1 || 0);
						let r = this.#values.get(index);
						if (!r) {
							this.#values.set(
								index,
								r = new Type(
									this.buffer,
									this.byteOffset + index * bpe,
									this.littleEndian,
								),
							);
						}
						return r;
					}

					public override set(index: number, value: T): void {
						index = (+index || 0) - (index % 1 || 0);
						let r = this.#values.get(index);
						if (!r) {
							this.#values.set(
								index,
								r = new Type(
									this.buffer,
									this.byteOffset + index * bpe,
									this.littleEndian,
								),
							);
						}
						assignType(r, value);
					}

					public static override readonly BYTES_PER_ELEMENT = bpe;

					static {
						constant(
							this.prototype,
							Symbol.toStringTag,
							`${Ptr.prototype[Symbol.toStringTag]}<${
								Type.prototype[Symbol.toStringTag]
							}>`,
						);
						constant(this, 'BYTES_PER_ELEMENT');
					}
				},
			}[name],
		);
	}
	return r;
}
