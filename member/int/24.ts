import {
	getInt24,
	getUint24,
	setInt24,
	setUint24,
} from '@hqtsm/dataview/int/24';

import type { MembersExtends } from '../../type.ts';
import type { Struct } from '../../struct.ts';
import { memberValue } from '../../value.ts';

/**
 * Member int24.
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
	return memberValue(
		StructC,
		name,
		byteOffset,
		3,
		littleEndian,
		'i24',
		function (): number {
			return getInt24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			setInt24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
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
export function uint24<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		3,
		littleEndian,
		'u24',
		function (): number {
			return getUint24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			setUint24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
