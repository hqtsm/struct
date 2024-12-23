/**
 * @module
 *
 * 64-bit integer.
 */

import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { constant, dataView } from '../util.ts';

/**
 * Member: int64.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function int64<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
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
		function (): bigint {
			return dataView(this.buffer).getBigInt64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: bigint): void {
			dataView(this.buffer).setBigInt64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: int64, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int64BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
	byteOffset: number | null = null,
): number {
	return int64(Type, name, byteOffset, false);
}

/**
 * Member: int64, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int64LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
	byteOffset: number | null = null,
): number {
	return int64(Type, name, byteOffset, true);
}

/**
 * Member: uint64.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function uint64<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
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
		function (): bigint {
			return dataView(this.buffer).getBigUint64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: bigint): void {
			dataView(this.buffer).setBigUint64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member: uint64, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint64BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
	byteOffset: number | null = null,
): number {
	return uint64(Type, name, byteOffset, false);
}

/**
 * Member: uint64, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint64LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, bigint>,
	byteOffset: number | null = null,
): number {
	return uint64(Type, name, byteOffset, true);
}

/**
 * Pointer: int64.
 */
export class Int64Ptr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64Ptr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Int64Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: int64, big endian.
 */
export class Int64BEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64BEPtr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Int64BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: int64, little endian.
 */
export class Int64LEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64LEPtr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
			true,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Int64LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint64.
 */
export class Uint64Ptr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64Ptr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Uint64Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint64.
 */
export class Uint64BEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64BEPtr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Uint64BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: uint64.
 */
export class Uint64LEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64LEPtr, 'new'>;

	public override get(index: number): bigint {
		index = (+index || 0) - (index % 1 || 0);
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
			true,
		);
	}

	public override set(index: number, value: bigint): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;

	static {
		constant(this.prototype, Symbol.toStringTag, 'Uint64LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
