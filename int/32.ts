import { defineMember } from '../member.ts';
import type { Members } from '../members.ts';
import { Ptr } from '../ptr.ts';
import type { Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int32.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int32<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteLength: 4,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getInt32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setInt32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: int32, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int32BE<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
): number {
	return int32(Type, name, byteOffset, false);
}

/**
 * Member: int32, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int32LE<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
): number {
	return int32(Type, name, byteOffset, true);
}

/**
 * Member: uint32.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint32<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteLength: 4,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getUint32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setUint32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint32, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint32BE<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
): number {
	return uint32(Type, name, byteOffset, false);
}

/**
 * Member: uint32, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint32LE<T extends Type>(
	Type: TypeClass<T>,
	name: Members<T, number>,
	byteOffset: number,
): number {
	return uint32(Type, name, byteOffset, true);
}

/**
 * Pointer: int32.
 */
export class Int32Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: int32, big endian.
 */
export class Int32BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32BEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: int32, little endian.
 */
export class Int32LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32LEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: uint32.
 */
export class Uint32Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: uint32, big endian.
 */
export class Uint32BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32BEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: uint32, little endian.
 */
export class Uint32LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32LEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}
