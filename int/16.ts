import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		get(): number {
			return dataView(this.buffer).getInt16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setInt16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: int16, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int16BE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return int16(Type, name, byteOffset, false);
}

/**
 * Member: int16, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int16LE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return int16(Type, name, byteOffset, true);
}

/**
 * Member: uint16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		get(): number {
			return dataView(this.buffer).getUint16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setUint16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint16, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint16BE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return uint16(Type, name, byteOffset, false);
}

/**
 * Member: uint16, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint16LE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return uint16(Type, name, byteOffset, true);
}

/**
 * Pointer: int16.
 */
export class Int16Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int16Ptr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: int16, big endian.
 */
export class Int16BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int16BEPtr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: int16, little endian.
 */
export class Int16LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int16LEPtr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			true,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: uint16.
 */
export class Uint16Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint16Ptr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: uint16, big endian.
 */
export class Uint16BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint16BEPtr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: uint16, little endian.
 */
export class Uint16LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint16LEPtr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
			true,
		);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}
