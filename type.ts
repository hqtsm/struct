/**
 * ArrayBufferLike, not similar but incompatible types.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Types of member type.
 */
export type MemberInfoType =
	// deno-lint-ignore ban-types
	| Function
	| null;

/**
 * Member info.
 */
export interface MemberInfo {
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
	 * Kind of member.
	 */
	kind: string;

	/**
	 * Signed or unsigned type, if applicable.
	 */
	signed: boolean | null;

	/**
	 * Type of member.
	 */
	Type: MemberInfoType;
}

/**
 * Member infos.
 */
export interface MemberInfos {
	/**
	 * Member infos.
	 */
	[member: PropertyKey]: Readonly<MemberInfo>;
}

/**
 * Type.
 */
export interface Type extends Readonly<ArrayBufferView> {
	/**
	 * Type class.
	 */
	readonly ['constructor']: TypeClass;

	/**
	 * True for little endian, false for big endian.
	 */
	readonly littleEndian: boolean;
}

/**
 * Type class.
 */
export interface TypeClass<T = Type> {
	/**
	 * Type prototype.
	 */
	readonly prototype: T;

	/**
	 * Instance size in bytes.
	 */
	readonly BYTE_LENGTH: number;

	/**
	 * Type members.
	 */
	readonly MEMBERS: Readonly<MemberInfos>;
}

/**
 * Type constructor.
 */
export interface TypeConstructor<T = Type> extends TypeClass<T> {
	/**
	 * Type constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		littleEndian?: boolean | null,
	): T;
}

/**
 * Type possible member keys.
 */
export type Members<T extends Type> = Exclude<keyof T, keyof Type>;

/**
 * Type possible member keys, that member type extends.
 */
export type MembersExtends<T extends Type, M> = {
	[K in Members<T>]: M extends T[K] ? K : never;
}[Members<T>];
