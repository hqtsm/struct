import type { Struct } from './struct.ts';

/**
 * Swap endian of struct.
 *
 * @param struct Struct to swap the endian of.
 * @param littleEndian Little endian, big endian, or default to swap.
 * @returns New struct of the same type and memory, different endian.
 */
export function endianSwap<T extends Struct>(
	struct: T,
	littleEndian: boolean | null = null,
): T {
	return new struct.constructor(
		struct.buffer,
		struct.byteOffset,
		littleEndian ?? !struct.littleEndian,
	) as T;
}

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
