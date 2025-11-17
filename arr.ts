/**
 * @module
 *
 * Array types and factory.
 */

import { MeekValueMap } from '@hqtsm/meek/valuemap';
import { type Class, constant, toStringTag } from '@hqtsm/class';
import type { MemberInfos, Members } from './members.ts';
import { pointer, type Ptr, type PtrConstructor } from './ptr.ts';
import type { Type, TypeConstructor } from './type.ts';

/**
 * Array.
 *
 * @template T Value type.
 */
export interface Arr<T = never> extends Ptr<T>, Type {
	/**
	 * Array constructor.
	 */
	readonly constructor: ArrClass<Arr<T>>;

	/**
	 * Array length.
	 */
	readonly length: number;

	/**
	 * Get iterator for values.
	 *
	 * @returns Value iterator.
	 */
	[Symbol.iterator](): ArrayIterator<T>;

	/**
	 * Get iterator for entries.
	 *
	 * @returns Entry iterator.
	 */
	entries(): ArrayIterator<[number, T]>;

	/**
	 * Get iterator for keys.
	 *
	 * @returns Key iterator.
	 */
	keys(): ArrayIterator<number>;

	/**
	 * Get iterator for values.
	 *
	 * @returns Value iterator.
	 */
	values(): ArrayIterator<T>;

	/**
	 * Get value at index.
	 *
	 * @param i Index, negative to index from end.
	 * @returns Value at index.
	 */
	at(i: number): T | undefined;
}

/**
 * Array constructor.
 *
 * @template T Array type.
 */
export interface ArrConstructor<T extends Arr<unknown> = Arr>
	extends Omit<PtrConstructor<T>, never>, Omit<TypeConstructor<T>, never> {
	/**
	 * Create instance for buffer.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferLike,
		byteOffset?: number,
		littleEndian?: boolean | null,
	): T;

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
 * Array class.
 *
 * @template T Array type.
 */
export type ArrClass<T extends Arr<unknown>> = Class<ArrConstructor<T>>;

const arrays = new WeakMap<
	PtrConstructor<Ptr<unknown>>,
	// deno-lint-ignore no-explicit-any
	MeekValueMap<number, ArrConstructor<Arr<any>>>
>();

/**
 * Create array of length from type/array.
 *
 * @template T Value type.
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
 * @template T Pointer type.
 * @param Ptr Pointer constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T>(
	Ptr: PtrConstructor<Ptr<T>> & { BYTE_LENGTH?: never },
	length: number,
): ArrConstructor<Arr<T>>;

/**
 * Create array of length from type/array or pointer.
 *
 * @template T Value type.
 * @param Type Type constructor or pointer constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T extends Type>(
	TypePtr: TypeConstructor<T> | PtrConstructor<Ptr<T>>,
	length: number,
): ArrConstructor<Arr<T>> {
	length = (+length || 0) - (length % 1 || 0);
	if (length < 0 || !(length < Infinity)) {
		throw new RangeError(`Invalid length: ${length}`);
	}
	const Ptr = 'BYTE_LENGTH' in TypePtr ? pointer(TypePtr) : TypePtr;
	let lengths = arrays.get(Ptr);
	if (!lengths) {
		arrays.set(Ptr, lengths = new MeekValueMap());
	}
	let r = lengths.get(length);
	if (!r) {
		const name = `${Ptr.name}[${length}]`;
		const tag = `${Ptr.prototype[Symbol.toStringTag]}[${length}]`;
		const members = new WeakMap<ArrConstructor<Arr<T>>, MemberInfos>();
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

					public *[Symbol.iterator](): ArrayIterator<T> {
						for (let i = 0; i < length; i++) {
							yield this[i];
						}
					}

					public *entries(): ArrayIterator<[number, T]> {
						for (let i = 0; i < length; i++) {
							yield [i, this[i]];
						}
					}

					public *keys(): ArrayIterator<number> {
						for (let i = 0; i < length; i++) {
							yield i;
						}
					}

					public *values(): ArrayIterator<T> {
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
						let r = members.get(this);
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
						toStringTag(this, tag);
						constant(this, 'BYTE_LENGTH');
						constant(this, 'LENGTH');
					}
				},
			}[name],
		);
	}
	return r;
}
