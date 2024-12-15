import type { EndianAware } from './endian.ts';
import type { MemberInfoed } from './members.ts';
import type { ArrayBufferReal, BufferView } from './native.ts';

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
export interface TypeClass<T extends Type = Type> extends MemberInfoed {
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
