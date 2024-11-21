import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { memberValue } from '../value.ts';

/**
 * Member int8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int8<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		1,
		null,
		'i8',
		function (): number {
			return this.dataView.getInt8(byteOffset);
		},
		function (value: number): void {
			this.dataView.setInt8(byteOffset, value);
		},
	);
}

/**
 * Member uint8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint8<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		1,
		null,
		'u8',
		function (): number {
			return this.dataView.getUint8(byteOffset);
		},
		function (value: number): void {
			this.dataView.setUint8(byteOffset, value);
		},
	);
}
