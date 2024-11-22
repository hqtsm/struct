import { defineMember } from '../member.ts';
import type { MembersExtends, Struct } from '../struct.ts';

/**
 * Member: int32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 4,
		littleEndian,
		kind: 'int',
		signed: true,
		Type: Number,
		get(): number {
			return this.dataView.getInt32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setInt32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 4,
		littleEndian,
		kind: 'int',
		signed: false,
		Type: Number,
		get(): number {
			return this.dataView.getUint32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setUint32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
