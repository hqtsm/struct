import { defineMember } from '../member.ts';
import type { MembersExtends, Struct } from '../struct.ts';

/**
 * Member: int16.
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
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		kind: 'int',
		signed: true,
		Type: Number,
		get(): number {
			return this.dataView.getInt16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setInt16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint16.
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
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		kind: 'int',
		signed: false,
		Type: Number,
		get(): number {
			return this.dataView.getUint16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setUint16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
