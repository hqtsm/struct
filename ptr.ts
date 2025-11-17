/**
 * @module
 *
 * Pointer types and factory.
 */

import { MeekValueMap } from '@hqtsm/meek/valuemap';
import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Endian } from './endian.ts';
import type { MemberInfo, MemberInfos, Members } from './members.ts';
import type { Type, TypeConstructor } from './type.ts';
import { assignType } from './util.ts';

const members = new WeakMap<typeof Ptr, MemberInfos>();
const pointers = new WeakMap<
	TypeConstructor<Type>,
	PtrConstructor<Ptr<Type>>
>();
const pointerValues = new WeakMap<Ptr<Type>, MeekValueMap<number, Type>>();

const handler: ProxyHandler<Ptr<unknown>> = {
	deleteProperty(target, key): boolean {
		let i;
		return Reflect.has(target, key) || (i = index(key)) === null
			? Reflect.deleteProperty(target, key)
			: i !== i - i % 1;
	},
	get(target, key, receiver: Ptr<unknown>): unknown | undefined {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.get(target, key, key in target ? target : receiver);
		}
		if (i === i - i % 1) {
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
			return Reflect.set(
				target,
				key,
				value,
				key in target ? target : receiver,
			);
		}
		if (i === i - i % 1) {
			receiver.set(i, value);
		}
		return true;
	},
};

function values<T extends Ptr<Type>>(p: T): MeekValueMap<number, T[number]> {
	let r = pointerValues.get(p);
	if (!r) {
		pointerValues.set(p, r = new MeekValueMap<number, Type>());
	}
	return r;
}

function index(key: PropertyKey): number | null {
	let i;
	return key === '-0' ? NaN : (key === '' + (i = +String(key)) ? i : null);
}

function memberGet(
	bpe: number,
	target: Readonly<MemberInfos>,
	key: string | symbol,
	receiver: Readonly<MemberInfos>,
): Readonly<MemberInfo> | undefined {
	const i = index(key);
	if (i === null) {
		return Reflect.get(target, key, key in target ? target : receiver);
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
	return index(key) !== null || Reflect.has(target, key);
}

function memberSet(
	target: Readonly<MemberInfos>,
	key: string | symbol,
	value: unknown,
	receiver: Readonly<MemberInfos>,
): boolean {
	return (
		index(key) === null &&
		Reflect.set(target, key, value, key in target ? target : receiver)
	);
}

/**
 * Pointer to a type.
 *
 * @template T Value type.
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
		buffer: ArrayBufferLike,
		byteOffset?: number,
		littleEndian?: boolean | null,
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
		let r = members.get(this);
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
		}
		return r;
	}

	static {
		toStringTag(this, 'Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
		constant(this, 'OVERLAPPING');
	}
}

/**
 * Pointer constructor.
 *
 * @template T Pointer type.
 */
export type PtrConstructor<T extends Ptr<unknown> = Ptr> = typeof Ptr<
	T[number]
>;

/**
 * Pointer class.
 *
 * @template T Pointer type.
 */
export type PtrClass<T extends Ptr<unknown> = Ptr> = Class<PtrConstructor<T>>;

/**
 * Get pointer of type.
 *
 * @template T Type.
 * @param Type Type constructor.
 * @returns Ptr constructor.
 */
export function pointer<T extends Type>(
	Type: TypeConstructor<T>,
): PtrConstructor<Ptr<T>> {
	let r = pointers.get(Type) as PtrConstructor<Ptr<T>> | undefined;
	if (!r) {
		const name = `Ptr<${Type.name}>`;
		const tag = `Ptr<${Type.prototype[Symbol.toStringTag]}>`;
		const bpe = Type.BYTE_LENGTH;
		pointers.set(
			Type,
			r = {
				[name]: class extends Ptr<T> {
					declare public readonly ['constructor']: PtrClass<Ptr<T>>;

					public override get(index: number): T {
						index = (+index || 0) - (index % 1 || 0);
						const v = values(this);
						let r = v.get(index);
						if (!r) {
							v.set(
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
						const v = values(this);
						let r = v.get(index);
						if (!r) {
							v.set(
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
						toStringTag(this, tag);
						constant(this, 'BYTES_PER_ELEMENT');
					}
				},
			}[name],
		);
	}
	return r;
}
