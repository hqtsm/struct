import type { BufferView } from './native.ts';
import type { Ptr, PtrClass } from './ptr.ts';
import type { Membered, Members, Type, TypeClass } from './type.ts';

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
export function getByteOffset<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T>,
): number;

/**
 * Get byte offset of index.
 *
 * @param Ptr Ptr class.
 * @param index Member index.
 * @returns Byte offset.
 */
export function getByteOffset<T extends Ptr<unknown>>(
	Ptr: PtrClass<T>,
	index: number,
): number;

export function getByteOffset(
	Type: Membered,
	name: PropertyKey,
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
export function getByteLength<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T>,
): number;

/**
 * Get byte length of member.
 *
 * @param Ptr Ptr class.
 * @param index Member index.
 * @returns Byte length.
 */
export function getByteLength<T extends Ptr<unknown>>(
	Ptr: PtrClass<T>,
	index: number,
): number;

export function getByteLength(
	Type: Membered,
	name: PropertyKey,
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
