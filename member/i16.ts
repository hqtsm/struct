import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getInt16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setInt16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 2, littleEndian, 'i16');
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
export function memberU16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getUint16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setUint16(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 2, littleEndian, 'u16');
}
