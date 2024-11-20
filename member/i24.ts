import { getInt24, getUint24, setInt24, setUint24 } from '@hqtsm/dataview/i24';

import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int24.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI24<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return getInt24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			setInt24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 3, littleEndian, 'i24');
}

/**
 * Member uint24.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU24<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return getUint24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			setUint24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 3, littleEndian, 'u24');
}
