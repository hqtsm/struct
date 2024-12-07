import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int64.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int64<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 8,
		get(): bigint {
			return dataView(this.buffer).getBigInt64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: bigint): void {
			dataView(this.buffer).setBigInt64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: int64, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int64BE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
): number {
	return int64(Type, name, byteOffset, false);
}

/**
 * Member: int64, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int64LE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
): number {
	return int64(Type, name, byteOffset, true);
}

/**
 * Member: uint64.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint64<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 8,
		get(): bigint {
			return dataView(this.buffer).getBigUint64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: bigint): void {
			dataView(this.buffer).setBigUint64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint64, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint64BE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
): number {
	return uint64(Type, name, byteOffset, false);
}

/**
 * Member: uint64, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint64LE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, bigint>,
	byteOffset: number,
): number {
	return uint64(Type, name, byteOffset, true);
}

/**
 * Pointer: int64.
 */
export class Int64Ptr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64Ptr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}

/**
 * Pointer: int64, big endian.
 */
export class Int64BEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64BEPtr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}

/**
 * Pointer: int64, little endian.
 */
export class Int64LEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Int64LEPtr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * 8,
			true,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * 8,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}

/**
 * Pointer: uint64.
 */
export class Uint64Ptr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64Ptr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}

/**
 * Pointer: uint64.
 */
export class Uint64BEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64BEPtr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}

/**
 * Pointer: uint64.
 */
export class Uint64LEPtr extends Ptr<bigint> {
	declare public readonly ['constructor']: Omit<typeof Uint64LEPtr, 'new'>;

	protected override [Ptr.getter](index: number): bigint {
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * 8,
			true,
		);
	}

	protected override [Ptr.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * 8,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 8;
}
