/**
 * @module
 *
 * 16-bit boolean.
 */

import { constant, toStringTag } from '@hqtsm/class';
import { defineMember, nextByteOffset } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool16.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function bool16<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
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
		function (): boolean {
			return !!dataView(this.buffer).getInt16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: boolean): void {
			dataView(this.buffer).setInt16(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: bool16, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool16BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool16(Type, name, byteOffset, false);
}

/**
 * Member: bool16, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool16LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool16(Type, name, byteOffset, true);
}

/**
 * Pointer: bool16.
 */
export class Bool16Ptr extends Ptr<boolean> {
	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Bool16Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: bool16, big endian.
 */
export class Bool16BEPtr extends Ptr<boolean> {
	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Bool16BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: bool16, little endian.
 */
export class Bool16LEPtr extends Ptr<boolean> {
	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			true,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Bool16LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
