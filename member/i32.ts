import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { memberValue } from '../value.ts';

/**
 * Member int32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		4,
		littleEndian,
		'i32',
		function (): number {
			return this.dataView.getInt32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setInt32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member uint32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		4,
		littleEndian,
		'u32',
		function (): number {
			return this.dataView.getUint32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setUint32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
