import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

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
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getInt32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setInt32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 4, littleEndian, 'i32');
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
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getUint32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setUint32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 4, littleEndian, 'u32');
}
