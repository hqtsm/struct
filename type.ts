/**
 * @module
 *
 * Type types.
 */

import type { Class } from '@hqtsm/class';
import type { Endian, EndianConstructor } from './endian.ts';
import type { MembersClass } from './members.ts';

/**
 * Type.
 */
export interface Type extends Endian, ArrayBufferView {}

/**
 * Type constructor.
 *
 * @template T Type.
 */
export interface TypeConstructor<T extends Type = Type>
	extends Omit<EndianConstructor, never>, Omit<MembersClass, never> {
	/**
	 * Create instance for buffer.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferLike,
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
