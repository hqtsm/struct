import type { MembersExtends, Struct } from '../../struct.ts';
import { memberValue } from '../../value.ts';

/**
 * Member int64.
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
	return memberValue(
		StructC,
		name,
		byteOffset,
		8,
		littleEndian,
		'i64',
		function (): bigint {
			return this.dataView.getBigInt64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: bigint): void {
			this.dataView.setBigInt64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member uint64.
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
	return memberValue(
		StructC,
		name,
		byteOffset,
		8,
		littleEndian,
		'u64',
		function (): bigint {
			return this.dataView.getBigUint64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: bigint): void {
			this.dataView.setBigUint64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
