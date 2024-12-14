import {
	getInt24,
	getUint24,
	setInt24,
	setUint24,
} from '@hqtsm/dataview/int/24';

import { defineMember } from '../member.ts';
import type { Memberable } from '../members.ts';
import { Ptr } from '../ptr.ts';
import type { Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int24.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int24<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteLength: 3,
		byteOffset,
		get(): number {
			return getInt24(
				dataView(this.buffer),
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			setInt24(
				dataView(this.buffer),
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: int24, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int24BE<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
): number {
	return int24(Type, name, byteOffset, false);
}

/**
 * Member: int24, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int24LE<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
): number {
	return int24(Type, name, byteOffset, true);
}

/**
 * Member: uint24.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint24<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteLength: 3,
		byteOffset,
		get(): number {
			return getUint24(
				dataView(this.buffer),
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			setUint24(
				dataView(this.buffer),
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint24, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint24BE<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
): number {
	return uint24(Type, name, byteOffset, false);
}

/**
 * Member: uint24, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint24LE<T extends Type>(
	Type: TypeClass<T>,
	name: Memberable<T, number>,
	byteOffset: number,
): number {
	return uint24(Type, name, byteOffset, true);
}

/**
 * Pointer: int24.
 */
export class Int24Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int24Ptr, 'new'>;

	public override get(index: number): number {
		return getInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		setInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Pointer: int24, big endian.
 */
export class Int24BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int24BEPtr, 'new'>;

	public override get(index: number): number {
		return getInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
		);
	}

	public override set(index: number, value: number): void {
		setInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Pointer: int24, little endian.
 */
export class Int24LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int24LEPtr, 'new'>;

	public override get(index: number): number {
		return getInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			true,
		);
	}

	public override set(index: number, value: number): void {
		setInt24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Pointer: uint24.
 */
export class Uint24Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint24Ptr, 'new'>;

	public override get(index: number): number {
		return getUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		setUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Pointer: uint24, big endian.
 */
export class Uint24BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint24BEPtr, 'new'>;

	public override get(index: number): number {
		return getUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
		);
	}

	public override set(index: number, value: number): void {
		setUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Pointer: uint24, little endian.
 */
export class Uint24LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint24LEPtr, 'new'>;

	public override get(index: number): number {
		return getUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			true,
		);
	}

	public override set(index: number, value: number): void {
		setUint24(
			dataView(this.buffer),
			this.byteOffset + index * 3,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 3;
}
