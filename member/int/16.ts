import type { MembersExtends } from '../../type.ts';
import type { Struct } from '../../struct.ts';
import { memberValue } from '../../value.ts';

/**
 * Member int16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		2,
		littleEndian,
		'i16',
		function (): number {
			return this.dataView.getInt16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setInt16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}

/**
 * Member uint16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		2,
		littleEndian,
		'u16',
		function (): number {
			return this.dataView.getUint16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setUint16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
