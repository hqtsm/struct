import { MeekValueMap } from '@hqtsm/meek/valuemap';

import type { MemberInfoed, MemberInfos } from './members.ts';
import type { ArrayBufferReal } from './native.ts';
import {
	pointer,
	type Ptr,
	type PtrClass,
	type PtrConstructor,
} from './ptr.ts';
import type { Type, TypeClass, TypeConstructor } from './type.ts';

/**
 * Array.
 */
export interface Arr<T = never> extends Ptr<T>, Type {
	/**
	 * Array constructor.
	 */
	readonly constructor: PtrClass<Ptr<T>> & TypeClass;

	/**
	 * Array length.
	 */
	readonly length: number;
}

/**
 * Array class.
 */
export interface ArrClass<T extends Arr<unknown> = Arr>
	extends PtrClass<T>, TypeClass {
	/**
	 * Array prototype.
	 */
	readonly prototype: T;

	/**
	 * Array length.
	 */
	readonly LENGTH: number;
}

/**
 * Array constructor.
 */
export interface ArrConstructor<T extends Arr<unknown> = Arr>
	extends ArrClass<T> {
	/**
	 * Create instance for buffer.
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

let arrays: WeakMap<
	PtrConstructor<Ptr<unknown>>,
	// deno-lint-ignore no-explicit-any
	MeekValueMap<number, ArrConstructor<Arr<any>>>
>;

/**
 * Create array of length from type/array.
 *
 * @param Type Type constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T extends Type>(
	Type: TypeConstructor<T>,
	length: number,
): ArrConstructor<Arr<T>>;

/**
 * Create array of length from pointer.
 *
 * @param Ptr Pointer constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T>(
	Ptr: PtrConstructor<Ptr<T>> & { BYTE_LENGTH?: never },
	length: number,
): ArrConstructor<Arr<T>>;

export function array<T extends Type>(
	TypePtr: TypeConstructor<T> | PtrConstructor<Ptr<T>>,
	length: number,
): ArrConstructor<Arr<T>> {
	if (length < 0 || length > 0x1fffffffffffff) {
		throw new RangeError(`Invalid length: ${length}`);
	}
	length = length - length % 1 || 0;
	const Ptr = 'BYTE_LENGTH' in TypePtr ? pointer(TypePtr) : TypePtr;
	let lengths = (arrays ??= new WeakMap()).get(Ptr);
	if (!lengths) {
		arrays.set(Ptr, lengths = new MeekValueMap());
	}
	let r = lengths.get(length);
	if (!r) {
		const name = `${Ptr.name}[${length}]`;
		let members: WeakMap<ArrConstructor<Arr<T>>, MemberInfos>;
		lengths.set(
			length,
			r = {
				[name]: class extends Ptr implements Arr<T>, MemberInfoed {
					declare public readonly ['constructor']: ArrClass<Arr<T>>;

					public get byteLength(): number {
						return this.constructor.BYTE_LENGTH;
					}

					public get length(): number {
						return length;
					}

					public static readonly BYTE_LENGTH = (
						Ptr.BYTES_PER_ELEMENT * length
					);

					public static readonly LENGTH = length;

					public static override get MEMBERS(): MemberInfos {
						let r = (members ??= new WeakMap()).get(this);
						if (!r) {
							members.set(
								this satisfies ArrConstructor<Arr<T>>,
								r = Object.create(
									Object.getPrototypeOf(this).MEMBERS,
								) as MemberInfos,
							);
						}
						return r;
					}
				},
			}[name],
		);
	}
	return r;
}
