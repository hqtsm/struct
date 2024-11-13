import type { KeyofType, ReadonlyKeyofType } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member int8.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @returns Byte length.
 */
export function memberI8<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], number>,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): number {
			return this.dataView.getInt8(offset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt8(offset, value);
		},
	});
	return 1;
}

/**
 * Member uint8.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @returns Byte length.
 */
export function memberU8<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], number>,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): number {
			return this.dataView.getUint8(offset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint8(offset, value);
		},
	});
	return 1;
}

/**
 * Member int8 array.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param count Array length.
 * @returns Byte length.
 */
export function memberI8A<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: ReadonlyKeyofType<T['prototype'], Int8Array>,
	count: number,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): Int8Array {
			return new Int8Array(this.buffer, this.byteOffset + offset, count);
		},
	});
	return count;
}

/**
 * Member uint8 array.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param count Array length.
 * @returns Byte length.
 */
export function memberU8A<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: ReadonlyKeyofType<T['prototype'], Uint8Array>,
	count: number,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): Uint8Array {
			return new Uint8Array(this.buffer, this.byteOffset + offset, count);
		},
	});
	return count;
}
