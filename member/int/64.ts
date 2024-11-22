import { defineMember } from '../../member.ts';
import type { MembersExtends, Struct } from '../../struct.ts';

/**
 * Member: int64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int64<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 8,
		littleEndian,
		Type: 'i64',
		get(): bigint {
			return this.dataView.getBigInt64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: bigint): void {
			this.dataView.setBigInt64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint64<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 8,
		littleEndian,
		Type: 'u64',
		get(): bigint {
			return this.dataView.getBigUint64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: bigint): void {
			this.dataView.setBigUint64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
