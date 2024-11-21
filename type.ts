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
export type Members<S extends Struct> = Exclude<keyof S, keyof Struct>;

/**
 * Possible members of a struct that another type extends.
 */
export type MembersExtends<S extends Struct, M> = Exclude<
	KeyofExtends<S, M>,
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
export type MemberInfo = {
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

/**
 * Member infos.
 */
export type MemberInfos = { [member: PropertyKey]: Readonly<MemberInfo> };
