import type { Struct } from './struct.ts';

/**
 * Keys of a type that another type extends.
 */
export type KeyofExtends<T, E> = {
	[K in keyof T]: E extends T[K] ? K : never;
}[keyof T];

/**
 * Possible members of a struct.
 */
// deno-lint-ignore no-explicit-any
export type Members<S extends typeof Struct> = MembersExtends<S, any>;

/**
 * Possible members of a struct that another type extends.
 */
export type MembersExtends<S extends typeof Struct, T> = Exclude<
	KeyofExtends<S['prototype'], T>,
	keyof Struct
>;

/**
 * Array buffer type, excluding similar incompatible types like typed arrays.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Types of child structures.
 */
export type ChildTypes =
	| typeof Int8Array
	| typeof Uint8Array
	| typeof Uint8ClampedArray
	| typeof Struct;

/**
 * Types of member type.
 */
export type MemberTypes = string | ChildTypes;

/**
 * Member info.
 */
export type Member = {
	/**
	 * Byte offset.
	 */
	byteOffset: number;

	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Little endian, big endian, or default.
	 */
	littleEndian: boolean | null;

	/**
	 * Type of member.
	 */
	Type: MemberTypes;
};
