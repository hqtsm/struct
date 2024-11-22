import {
	getInt24,
	getUint24,
	setInt24,
	setUint24,
} from '@hqtsm/dataview/int/24';

import type { MembersExtends, Struct } from '../struct.ts';
import { defineMember } from '../member.ts';

/**
 * Member: int24.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int24<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 3,
		littleEndian,
		Type: 'i24',
		get(): number {
			return getInt24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			setInt24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint24.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint24<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 3,
		littleEndian,
		Type: 'u24',
		get(): number {
			return getUint24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			setUint24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
