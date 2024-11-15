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
	name: Exclude<KeyofExtends<T['prototype'], number>, keyof Struct>,
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
	name: Exclude<KeyofExtends<T['prototype'], number>, keyof Struct>,
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
	name: Exclude<
		ReadonlyKeyofExtends<T['prototype'], Int8Array>,
		keyof Struct
	>,
	byteOffset: number,
): number {
	const m = new WeakMap<T['prototype'], Int8Array>();
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): Int8Array {
			let r = m.get(this);
			if (!r) {
				r = new Int8Array(
					this.buffer,
					this.byteOffset + byteOffset,
					count,
				);
				m.set(this, r);
			}
			return r;
		},
	});
	return member(StructT, name, byteOffset, count, null, 'i8a');
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
	name: Exclude<
		ReadonlyKeyofExtends<T['prototype'], Uint8Array>,
		keyof Struct
	>,
	byteOffset: number,
): number {
	const m = new WeakMap<T['prototype'], Uint8Array>();
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): Uint8Array {
			let r = m.get(this);
			if (!r) {
				r = new Uint8Array(
					this.buffer,
					this.byteOffset + byteOffset,
					count,
				);
				m.set(this, r);
			}
			return r;
		},
	});
	return member(StructT, name, byteOffset, count, null, 'u8a');
}
