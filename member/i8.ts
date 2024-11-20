import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int8.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberI8<T extends typeof Struct>(
	StructT: T,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getInt8(byteOffset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt8(byteOffset, value);
		},
	});
	return member(StructT, name, byteOffset, 1, null, 'i8');
}

/**
 * Member uint8.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberU8<T extends typeof Struct>(
	StructT: T,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getUint8(byteOffset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint8(byteOffset, value);
		},
	});
	return member(StructT, name, byteOffset, 1, null, 'u8');
}
