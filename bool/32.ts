/**
 * @module
 *
 * 32-bit boolean.
 */

import { type Class, constant, toStringTag } from '@hqtsm/class';
import { defineMember, nextByteOffset } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool32.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function bool32<T extends MemberableClass>(
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
		4,
		byteOffset,
		function (): boolean {
			return !!dataView(this.buffer).getInt32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: boolean): void {
			dataView(this.buffer).setInt32(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: bool32, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool32BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool32(Type, name, byteOffset, false);
}

/**
 * Member: bool32, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool32LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool32(Type, name, byteOffset, true);
}

/**
 * Pointer: bool32.
 */
export class Bool32Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Class<typeof Bool32Ptr>;

	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Bool32Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: bool32, big endian.
 */
export class Bool32BEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Class<typeof Bool32BEPtr>;

	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Bool32BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: bool32, little endian.
 */
export class Bool32LEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Class<typeof Bool32LEPtr>;

	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Bool32LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
