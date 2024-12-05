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
