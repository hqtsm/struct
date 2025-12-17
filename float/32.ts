/**
 * @module
 *
 * 32-bit float.
 */

import { constant, toStringTag } from '@hqtsm/class';
import { defineMember, nextByteOffset } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: float32.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function float32<T extends MemberableClass>(
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
		4,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getFloat32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			dataView(this.buffer).setFloat32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: float32, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float32BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float32(Type, name, byteOffset, false);
}

/**
 * Member: float32, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float32LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float32(Type, name, byteOffset, true);
}

/**
 * Pointer: float32.
 */
export class Float32Ptr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Float32Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float32, big endian.
 */
export class Float32BEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Float32BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float32, little endian.
 */
export class Float32LEPtr extends Ptr<number> {
	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		toStringTag(this, 'Float32LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
