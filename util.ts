/**
 * @module
 *
 * Utility types and functions.
 */

import type { MemberClassKeys, MemberedClass } from './members.ts';
import type { BufferView } from './native.ts';
import type { Type } from './type.ts';

/**
 * If types are equal.
 */
export type TypesEqual<A, B, X = A, Y = never> = (
	<T>() => T extends A ? 1 : 2
) extends (
	<T>() => T extends B ? 1 : 2
) ? X
	: Y;

/**
 * Readonly keys.
 */
export type ReadonlyKeyof<T> = {
	[K in keyof T]: TypesEqual<
		{ [Q in K]: T[K] },
		{ -readonly [Q in K]: T[K] },
		never,
		K
	>;
}[keyof T];

/**
 * Define constant.
 *
 * @param o Object.
 * @param key Key.
 * @param value Value, or undefined for current value.
 */
export function constant<T, K extends ReadonlyKeyof<T>>(
	o: T,
	key: K,
	value: T[K] | undefined = undefined,
): void {
	Object.defineProperty(o, key, {
		value: value === undefined ? o[key] : value,
		configurable: false,
		enumerable: false,
		writable: false,
	});
}

let dataViews: WeakMap<ArrayBufferLike, DataView>;

/**
 * Get reusable data view of buffer.
 *
 * @param buffer Array buffer.
 * @returns Data view.
 */
export function dataView(buffer: ArrayBufferLike): DataView {
	let r = (dataViews ??= new WeakMap()).get(buffer);
	if (!r) {
		dataViews.set(buffer, r = new DataView(buffer));
	}
	return r;
}

/**
 * Get byte offset of member.
 *
 * @param Type Type class.
 * @param name Member name.
 * @returns Byte offset.
 */
export function getByteOffset<T extends MemberedClass>(
	Type: T,
	name: MemberClassKeys<T>,
): number {
	return Type.MEMBERS[name].byteOffset;
}

/**
 * Get byte length of member.
 *
 * @param Type Type class.
 * @param name Member name.
 * @returns Byte length.
 */
export function getByteLength<T extends MemberedClass>(
	Type: T,
	name: MemberClassKeys<T>,
): number {
	return Type.MEMBERS[name].byteLength;
}

/**
 * Assign ArrayBuffer data from one view to another.
 *
 * @param dst Destination memory.
 * @param src Source memory of equal or greater size.
 * @returns Destination memory.
 */
export function assignView<D extends BufferView>(
	dst: D,
	src: BufferView,
): D {
	const { byteLength } = dst;
	new Uint8Array(dst.buffer, dst.byteOffset, byteLength).set(
		new Uint8Array(src.buffer, src.byteOffset, byteLength),
	);
	return dst;
}

/**
 * Assign ArrayBuffer data from one type to another.
 *
 * @param dst Destination type.
 * @param src Source type, must extend destination type.
 * @returns Destination type.
 */
export function assignType<D extends Type, S extends D>(
	dst: D,
	src: S,
): D {
	return assignView(dst, src);
}
