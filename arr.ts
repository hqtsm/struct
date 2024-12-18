/**
 * @module
 *
 * Array types and factory.
 */

import { MeekValueMap } from '@hqtsm/meek/valuemap';
import type { MemberInfos, Members } from './members.ts';
import type { ArrayBufferReal } from './native.ts';
import {
	pointer,
	type Ptr,
	type PtrClass,
	type PtrConstructor,
} from './ptr.ts';
import type { Type, TypeClass, TypeConstructor } from './type.ts';
import { constant } from './util.ts';

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

	/**
	 * Get iterator for values.
	 *
	 * @returns Value iterator.
	 */
	[Symbol.iterator](): Generator<T, undefined, unknown>;

	/**
	 * Get iterator for entries.
	 *
	 * @returns Entry iterator.
	 */
	entries(): Generator<[number, T], undefined, unknown>;

	/**
	 * Get iterator for keys.
	 *
	 * @returns Key iterator.
	 */
	keys(): Generator<number, undefined, unknown>;

	/**
	 * Get iterator for values.
	 *
	 * @returns Value iterator.
	 */
	values(): Generator<T, undefined, unknown>;

	/**
	 * Get value at index.
	 *
	 * @param i Index, negative to index from end.
	 * @returns Value at index.
	 */
	at(i: number): T | undefined;
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
		littleEndian?: boolean | null,
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
	length = (+length || 0) - (length % 1 || 0);
	if (length < 0 || !(length < Infinity)) {
		throw new RangeError(`Invalid length: ${length}`);
	}
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
				[name]: class extends Ptr implements Arr<T>, Members {
					declare public readonly ['constructor']: ArrClass<Arr<T>>;

					public get byteLength(): number {
						return this.constructor.BYTE_LENGTH;
					}

					public get length(): number {
						return length;
					}

					public *[Symbol.iterator](): Generator<
						T,
						undefined,
						unknown
					> {
						for (let i = 0; i < length; i++) {
							yield this[i];
						}
					}

					public *entries(): Generator<
						[number, T],
						undefined,
						unknown
					> {
						for (let i = 0; i < length; i++) {
							yield [i, this[i]];
						}
					}

					public *keys(): Generator<number, undefined, unknown> {
						for (let i = 0; i < length; i++) {
							yield i;
						}
					}

					public *values(): Generator<T, undefined, unknown> {
						for (let i = 0; i < length; i++) {
							yield this[i];
						}
					}

					public at(i: number): T | undefined {
						i = (+i || 0) - (i % 1 || 0);
						if ((i < 0 ? i += length : i) >= 0 && i < length) {
							return this[i];
						}
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

					static {
						constant(
							this.prototype,
							Symbol.toStringTag,
							`${Ptr.prototype[Symbol.toStringTag]}[${length}]`,
						);
						constant(this, 'BYTE_LENGTH');
						constant(this, 'LENGTH');
					}
				},
			}[name],
		);
	}
	return r;
}
