import { defineMember } from '../member.ts';
import type { MembersExtends, Struct } from '../struct.ts';

/**
 * Member: int8.
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
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		Type: 'i8',
		get(): number {
			return this.dataView.getInt8(byteOffset);
		},
		set(value: number): void {
			this.dataView.setInt8(byteOffset, value);
		},
	});
}

/**
 * Member: uint8.
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
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		Type: 'u8',
		get(): number {
			return this.dataView.getUint8(byteOffset);
		},
		set(value: number): void {
			this.dataView.setUint8(byteOffset, value);
		},
	});
}