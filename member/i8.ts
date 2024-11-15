import type { KeyofExtends, ReadonlyKeyofExtends } from '../type.ts';
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
	name: KeyofExtends<T['prototype'], number>,
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
	return member(StructT, name, byteOffset, 1, null);
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
	name: KeyofExtends<T['prototype'], number>,
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
	return member(StructT, name, byteOffset, 1, null);
}

/**
 * Member int8 array.
 *
 * @param count Array length.
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberI8A<T extends typeof Struct>(
	count: number,
	StructT: T,
	name: ReadonlyKeyofExtends<T['prototype'], Int8Array>,
	byteOffset: number,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): Int8Array {
			return new Int8Array(
				this.buffer,
				this.byteOffset + byteOffset,
				count,
			);
		},
	});
	return member(StructT, name, byteOffset, count, null);
}

/**
 * Member uint8 array.
 *
 * @param count Array length.
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberU8A<T extends typeof Struct>(
	count: number,
	StructT: T,
	name: ReadonlyKeyofExtends<T['prototype'], Uint8Array>,
	byteOffset: number,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): Uint8Array {
			return new Uint8Array(
				this.buffer,
				this.byteOffset + byteOffset,
				count,
			);
		},
	});
	return member(StructT, name, byteOffset, count, null);
}
