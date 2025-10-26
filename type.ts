/**
 * @module
 *
 * Type types.
 */

import type { Endian, EndianClass } from './endian.ts';
import type { MembersClass } from './members.ts';
import type { ArrayBufferReal, BufferView } from './native.ts';

/**
 * Type.
 */
export interface Type extends Endian, BufferView {
	/**
	 * Type class.
	 */
	readonly constructor: TypeClass;
}

/**
 * Type constructor.
 *
 * @template T Type.
 */
export interface TypeConstructor<T extends Type = Type>
	extends EndianClass, MembersClass {
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
 * Type class.
 *
 * @template T Type.
 */
export interface TypeClass<T extends Type = Type>
	extends Omit<TypeConstructor<T>, 'new'> {}
