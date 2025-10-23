/**
 * @module
 *
 * 8-bit integer.
 */

import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { constant, dataView } from '../util.ts';

/**
 * Member: int8.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		1,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getInt8(this.byteOffset + byteOffset);
		},
		function (value: number): void {
			dataView(this.buffer).setInt8(this.byteOffset + byteOffset, value);
		},
	);
}

/**
 * Member: uint8.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		1,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getUint8(this.byteOffset + byteOffset);
		},
		function (value: number): void {
			dataView(this.buffer).setUint8(this.byteOffset + byteOffset, value);
		},
	);
}

/**
 * Pointer: int8.
 */
export class Int8Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int8Ptr, 'new'>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Int8Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint8.
 */
export class Uint8Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint8Ptr, 'new'>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getUint8(this.byteOffset + index);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setUint8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Uint8Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
