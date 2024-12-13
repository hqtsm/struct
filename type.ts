import type { EndianAware } from './endian.ts';
import type { ArrayBufferReal, BufferView } from './native.ts';

/**
 * Member info.
 */
export interface MemberInfo {
	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Byte offset.
	 */
	byteOffset: number;
}

/**
 * Member infos.
 */
export interface MemberInfos {
	/**
	 * Member infos.
	 */
	readonly [member: PropertyKey]: Readonly<MemberInfo>;
}

/**
 * Membered type.
 */
export interface Membered {
	/**
	 * Member infos of members.
	 */
	readonly MEMBERS: MemberInfos;
}

/**
 * Type.
 */
export interface Type extends BufferView, EndianAware {
	/**
	 * Type class.
	 */
	readonly constructor: TypeClass;
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
 * The possible member keys.
 */
export type Members<T extends Type> = Exclude<keyof T, keyof Type>;

/**
 * The possible member keys, that member type extends.
 */
export type MembersExtends<T extends Type, M> = {
	[K in Members<T>]: M extends T[K] ? K : never;
}[Members<T>];
