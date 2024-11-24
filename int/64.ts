import { defineMember } from '../member.ts';
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
		littleEndian,
		kind: 'int',
		signed: true,
		Type: BigInt,
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
		littleEndian,
		kind: 'int',
		signed: false,
		Type: BigInt,
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
