import type { ReadonlyKeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

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
