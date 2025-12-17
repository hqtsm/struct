/**
 * @module
 *
 * 16-bit integer.
 */

import { constant, toStringTag } from '@hqtsm/class';
import { defineMember, nextByteOffset } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: int16.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function int16<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= nextByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		2,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getInt16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			dataView(this.buffer).setInt16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: int16, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int16BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return int16(Type, name, byteOffset, false);
}

/**
 * Member: int16, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int16LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return int16(Type, name, byteOffset, true);
}

/**
 * Member: uint16.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function uint16<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= nextByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		2,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getUint16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			dataView(this.buffer).setUint16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: uint16, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint16BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return uint16(Type, name, byteOffset, false);
}

/**
 * Member: uint16, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint16LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return uint16(Type, name, byteOffset, true);
}

/**
 * Pointer: int16.
 */
export class Int16Ptr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Int16Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: int16, big endian.
 */
export class Int16BEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Int16BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: int16, little endian.
 */
export class Int16LEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			true,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Int16LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint16.
 */
export class Uint16Ptr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Uint16Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint16, big endian.
 */
export class Uint16BEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Uint16BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint16, little endian.
 */
export class Uint16LEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
			true,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Uint16LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
