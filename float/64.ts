/**
 * @module
 *
 * 64-bit float.
 */

import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { constant, dataView } from '../util.ts';

/**
 * Member: float64.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function float64<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		8,
		byteOffset,
		function (): number {
			return dataView(this.buffer).getFloat64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			dataView(this.buffer).setFloat64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: float64, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float64BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float64(Type, name, byteOffset, false);
}

/**
 * Member: float64, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float64LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float64(Type, name, byteOffset, true);
}

/**
 * Pointer: float64.
 */
export class Float64Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float64Ptr, 'new'>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Float64Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float64, big endian.
 */
export class Float64BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float64BEPtr, 'new'>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * 8,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * 8,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Float64BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float64, little endian.
 */
export class Float64LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float64LEPtr, 'new'>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * 8,
			true,
		);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * 8,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Float64LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
