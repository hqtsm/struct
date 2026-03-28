/**
 * @module
 *
 * Type types.
 */

import type { Class } from '@hqtsm/class';
import type { Endian, EndianConstructor } from './endian.ts';
import type { MembersClass } from './members.ts';
import type { ArrayBufferType } from './native.ts';

/**
 * Type.
 *
 * @template TArrayBuffer Buffer type.
 */
export interface Type<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>
	extends Endian<TArrayBuffer>, ArrayBufferView<TArrayBuffer> {}

/**
 * Type constructor.
 *
 * @template T Type.
 */
export interface TypeConstructor<T extends Type = Type>
	extends
		Omit<EndianConstructor<ArrayBufferType<T>>, never>,
		Omit<MembersClass, never> {
	/**
	 * Create instance for buffer.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferType<T>,
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
export type TypeClass<T extends Type = Type> = Class<TypeConstructor<T>>;
