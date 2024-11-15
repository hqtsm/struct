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
	name: keyof T['prototype'],
): number {
	return StructT.MEMBERS[name].byteOffset;
}

/**
 * Get byte length of member, or full struct.
 *
 * @param StructT Struct constructor.
 * @param name Member name, else the whole struct.
 * @returns Byte length.
 */
export function byteLength<T extends typeof Struct>(
	StructT: T,
	name: keyof T['prototype'] | null = null,
): number {
	return name === null
		? StructT.BYTE_LENGTH
		: StructT.MEMBERS[name].byteLength;
}

/**
 * Get little endian value of member.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @returns Little endian, big endian, or default.
 */
export function littleEndian<T extends typeof Struct>(
	StructT: T,
	name: keyof T['prototype'],
): boolean | null {
	return StructT.MEMBERS[name].littleEndian;
}
