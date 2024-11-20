import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberI8<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getInt8(byteOffset);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setInt8(byteOffset, value);
		},
	});
	return member(StructC, name, byteOffset, 1, null, 'i8');
}

/**
 * Member uint8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberU8<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getUint8(byteOffset);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setUint8(byteOffset, value);
		},
	});
	return member(StructC, name, byteOffset, 1, null, 'u8');
}
