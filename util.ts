import type { MemberInfoType, Members, Struct } from './struct.ts';

let dataViews;

/**
 * Get reusable data view of buffer.
 *
 * @param buffer Array buffer.
 * @returns Data view.
 */
export function dataView(buffer: ArrayBufferLike): DataView {
	dataViews ??= new WeakMap<ArrayBufferLike, DataView>();
	let r = dataViews.get(buffer);
	if (!r) {
		dataViews.set(buffer, r = new DataView(buffer));
	}
	return r;
}

/**
 * Get byte offset of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Byte offset.
 */
export function getByteOffset<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): number {
	return StructC.MEMBERS[name].byteOffset;
}

/**
 * Get byte length of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Byte length.
 */
export function getByteLength<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): number {
	return StructC.MEMBERS[name].byteLength;
}

/**
 * Get little endian flag of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Little endian, big endian, or default.
 */
export function getLittleEndian<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): boolean | null {
	return StructC.MEMBERS[name].littleEndian;
}

/**
 * Get kind of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Kind.
 */
export function getKind<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): string {
	return StructC.MEMBERS[name].kind;
}

/**
 * Get signed of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Signed or null where not applicable.
 */
export function getSigned<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): boolean | null {
	return StructC.MEMBERS[name].signed;
}

/**
 * Get type of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Type.
 */
export function getType<C extends typeof Struct>(
	StructC: C,
	name: Members<C['prototype']>,
): MemberInfoType {
	return StructC.MEMBERS[name].Type;
}

/**
 * Assign ArrayBuffer data from one view to another.
 *
 * @param dst Destination memory.
 * @param src Source memory of equal or greater size.
 * @returns Destination memory.
 */
export function assignView<D extends ArrayBufferView>(
	dst: D,
	src: ArrayBufferView,
): D {
	const { byteLength } = dst;
	new Uint8Array(dst.buffer, dst.byteOffset, byteLength).set(
		new Uint8Array(src.buffer, src.byteOffset, byteLength),
	);
	return dst;
}

/**
 * Assign ArrayBuffer data from one struct to another.
 *
 * @param dst Destination struct.
 * @param src Source struct, must extend destination type.
 * @returns Destination struct.
 */
export function assignStruct<D extends Struct, S extends D>(
	dst: D,
	src: S,
): D {
	return assignView(dst, src);
}
