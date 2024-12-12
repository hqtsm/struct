import { MeekValueMap } from '@hqtsm/meek/valuemap';

import {
	pointer,
	type Ptr,
	type PtrClass,
	type PtrConstructor,
} from './ptr.ts';
import type {
	ArrayBufferReal,
	MemberInfos,
	Type,
	TypeClass,
	TypeConstructor,
} from './type.ts';

/**
 * Array.
 */
export interface Arr<T = never> extends Ptr<T>, Type {
	/**
	 * Array constructor.
	 */
	readonly constructor: PtrClass<T> & TypeClass;
}

/**
 * Array class.
 */
export interface ArrClass<T = never> extends PtrClass<T>, TypeClass {
	/**
	 * Array prototype.
	 */
	readonly prototype: Arr<T>;
}

/**
 * Array constructor.
 */
export interface ArrConstructor<T = never> extends ArrClass<T> {
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
	): Arr<T>;
}

let arrays: WeakMap<
	// deno-lint-ignore no-explicit-any
	PtrConstructor<any>,
	// deno-lint-ignore no-explicit-any
	MeekValueMap<number, ArrConstructor<any>>
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
): ArrConstructor<T>;

/**
 * Create array of length from pointer.
 *
 * @param Ptr Pointer constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T>(
	Ptr: PtrConstructor<T> & { BYTE_LENGTH?: never },
	length: number,
): ArrConstructor<T>;

export function array<T extends Type>(
	TypePtr: TypeConstructor<T> | PtrConstructor<T>,
	length: number,
): ArrConstructor<T> {
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
		let members: WeakMap<ArrConstructor<T>, MemberInfos>;
		lengths.set(
			length,
			r = {
				[name]: class extends Ptr implements Arr<T> {
					declare public readonly ['constructor']: ArrClass<T>;

					public get byteLength(): number {
						return this.constructor.BYTE_LENGTH;
					}

					public static readonly BYTE_LENGTH = Ptr.BYTES_PER_ELEMENT *
						length;

					public static override get MEMBERS(): Readonly<
						MemberInfos
					> {
						let r = (members ??= new WeakMap()).get(this);
						if (!r) {
							members.set(
								this satisfies ArrConstructor<T>,
								r = Object.create(
									Object.getPrototypeOf(this).MEMBERS ?? null,
								) as Readonly<MemberInfos>,
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

/**
 * Get length of array.
 *
 * @param Ptr Array class.
 * @returns Array length.
 */
export function length<T>(Ptr: ArrClass<T>): number {
	return Ptr.BYTE_LENGTH / Ptr.BYTES_PER_ELEMENT;
}
