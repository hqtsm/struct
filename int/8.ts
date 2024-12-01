import { defineMember } from '../member.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int8.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int8<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		type: 'int8',
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
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint8<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		type: 'uint8',
		get(): number {
			return dataView(this.buffer).getUint8(this.byteOffset + byteOffset);
		},
		set(value: number): void {
			dataView(this.buffer).setUint8(this.byteOffset + byteOffset, value);
		},
	});
}
