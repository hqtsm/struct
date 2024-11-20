import type { Struct } from './struct.ts';

/**
 * Swap endian of struct.
 *
 * @param struct Struct to swap the endian of.
 * @param littleEndian Little endian, big endian, or default to swap.
 * @returns New struct of the same type and memory, different endian.
 */
export function endianSwap<S extends Struct>(
	struct: S,
	littleEndian: boolean | null = null,
): S {
	return new struct.constructor(
		struct.buffer,
		struct.byteOffset,
		littleEndian ?? !struct.littleEndian,
	) as S;
}

/**
 * Get byte offset of member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @returns Byte offset.
 */
export function byteOffset<C extends typeof Struct>(
	StructC: C,
	name: Exclude<keyof C['prototype'], keyof Struct>,
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
export function byteLength<C extends typeof Struct>(
	StructC: C,
	name: Exclude<keyof C['prototype'], keyof Struct>,
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
export function littleEndian<C extends typeof Struct>(
	StructC: C,
	name: Exclude<keyof C['prototype'], keyof Struct>,
): boolean | null {
	return StructC.MEMBERS[name].littleEndian;
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
	name: Exclude<keyof C['prototype'], keyof Struct>,
): string | typeof Struct {
	return StructC.MEMBERS[name].Type;
}
