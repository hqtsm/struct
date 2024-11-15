import type { Struct } from './struct.ts';

/**
 * Get byte offset of member.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @returns Byte offset.
 */
export function byteOffset<T extends typeof Struct>(
	StructT: T,
	name: Exclude<keyof T['prototype'], keyof Struct>,
): number {
	return StructT.MEMBERS[name].byteOffset;
}

/**
 * Get byte length of member.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @returns Byte length.
 */
export function byteLength<T extends typeof Struct>(
	StructT: T,
	name: Exclude<keyof T['prototype'], keyof Struct>,
): number {
	return StructT.MEMBERS[name].byteLength;
}

/**
 * Get little endian flag of member.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @returns Little endian, big endian, or default.
 */
export function littleEndian<T extends typeof Struct>(
	StructT: T,
	name: Exclude<keyof T['prototype'], keyof Struct>,
): boolean | null {
	return StructT.MEMBERS[name].littleEndian;
}

/**
 * Get type of member.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @returns Type.
 */
export function getType<T extends typeof Struct>(
	StructT: T,
	name: Exclude<keyof T['prototype'], keyof Struct>,
): string | typeof Struct {
	return StructT.MEMBERS[name].Type;
}
