import { MeekValueMap } from '@hqtsm/meek/valuemap';
import { Endian } from './endian.ts';
import type { MemberInfo, MemberInfos, Members } from './members.ts';
import type { ArrayBufferReal } from './native.ts';
import type { Type, TypeConstructor } from './type.ts';
import { assignType } from './util.ts';

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
		throw new TypeError(`Read from void pointer: ${index}`);
	}

	/**
	 * Set accessor.
	 *
	 * @param index Pointer index.
	 * @param value Pointer value.
	 */
	public set(index: number, value: T): void {
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
			const bpe = this.BYTES_PER_ELEMENT;
			members.set(
				this,
				r = new Proxy(
					Object.create(
						Object.getPrototypeOf(this).MEMBERS ?? null,
					) as MemberInfos,
					{
						get(target, key): Readonly<MemberInfo> | undefined {
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
						},
						set(target, key, value): boolean {
							return index(key) === null
								? Reflect.set(target, key, value)
								: false;
						},
					},
				),
			);
			members.set(this, r);
		}
		return r;
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
		littleEndian?: boolean,
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
				},
			}[name],
		);
	}
	return r;
}
