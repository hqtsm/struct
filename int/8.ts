import { defineMember } from '../member.ts';
import type { Membered, MembersExtends } from '../struct.ts';
import { dataView } from '../util.ts';

/**
 * Member: int8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int8<C extends Membered>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		kind: 'int',
		signed: true,
		Type: Number,
		get(): number {
			return dataView(this.buffer).getInt8(this.byteOffset + byteOffset);
		},
		set(value: number): void {
			dataView(this.buffer).setInt8(this.byteOffset + byteOffset, value);
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
export function uint8<C extends Membered>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		kind: 'int',
		signed: false,
		Type: Number,
		get(): number {
			return dataView(this.buffer).getUint8(this.byteOffset + byteOffset);
		},
		set(value: number): void {
			dataView(this.buffer).setUint8(this.byteOffset + byteOffset, value);
		},
	});
}
