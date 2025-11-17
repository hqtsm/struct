/**
 * @module
 *
 * Utility types and functions.
 */

import type { MemberClassKeys, MemberedClass } from './members.ts';
import type { BufferView } from './native.ts';
import type { Type } from './type.ts';

const dataViews = new WeakMap<ArrayBufferLike, DataView>();

/**
 * Get reusable data view of buffer.
 *
 * @param buffer Array buffer.
 * @returns Data view.
 */
export function dataView(buffer: ArrayBufferLike): DataView {
	let r = dataViews.get(buffer);
	if (!r) {
		dataViews.set(buffer, r = new DataView(buffer));
	}
	return r;
}

/**
 * Get byte offset of member.
 *
 * @template T Type class.
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
 * @template T Type class.
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
 * Get members of type.
 * Array indexes then member keys from highest to lowest inheritance.
 *
 * @template T Type class.
 * @param Type Type class.
 * @returns Member list.
 */
export function getMembers<T extends MemberedClass>(
	Type: T,
): (keyof T['prototype'])[] {
	const props: Set<PropertyKey> | PropertyKey[] = new Set();
	for (let m = Type.MEMBERS; m; m = Object.getPrototypeOf(m)) {
		const keys = Reflect.ownKeys(m);
		for (let i = keys.length; i--;) {
			const k = keys[i];
			props.delete(k);
			props.add(k);
		}
	}
	if ('LENGTH' in Type) {
		for (let i = Type.LENGTH; i--;) {
			props.delete(`${i}`);
			props.add(i);
		}
	}
	return [...props].reverse() as (keyof T['prototype'])[];
}

/**
 * Assign ArrayBuffer data from one view to another.
 *
 * @template D Destination type.
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
 * @template D Destination type.
 * @template S Source type.
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
