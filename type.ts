/**
 * ArrayBufferLike, not similar but incompatible types.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Buffer pointer.
 */
export interface BufferPointer {
	/**
	 * ArrayBuffer instance.
	 */
	readonly buffer: ArrayBufferLike;

	/**
	 * Byte offset into buffer.
	 */
	readonly byteOffset: number;
}

/**
 * Buffer view.
 */
export interface BufferView extends BufferPointer {
	/**
	 * Byte length of view.
	 */
	readonly byteLength: number;
}

/**
 * Endian aware.
 */
export interface EndianAware {
	/**
	 * True for little endian, false for big endian.
	 */
	readonly littleEndian: boolean;
}

/**
 * Signed of member type.
 */
export type MemberInfoSigned = boolean | null;

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
 * Membered type.
 */
export interface Membered {
	/**
	 * Member infos of members.
	 */
	readonly MEMBERS: Readonly<MemberInfos>;
}

/**
 * Type.
 */
export interface Type extends BufferView, EndianAware {
	/**
	 * Type class.
	 */
	readonly ['constructor']: TypeClass;
}

/**
 * Type class.
 */
export interface TypeClass<T extends Type = Type> extends Membered {
	/**
	 * Type prototype.
	 */
	readonly prototype: T;

	/**
	 * Instance size in bytes.
	 */
	readonly BYTE_LENGTH: number;
}

/**
 * Type constructor.
 */
export interface TypeConstructor<T extends Type = Type> extends TypeClass<T> {
	/**
	 * Create instance for buffer.
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
