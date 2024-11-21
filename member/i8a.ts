import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';
import { assignView } from '../macro.ts';

/**
 * Member int8 array.
 *
 * @param count Array length.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberI8A<C extends typeof Struct>(
	count: number,
	StructC: C,
	name: MembersExtends<C, Int8Array>,
	byteOffset: number,
): number {
	const m = new WeakMap<C['prototype'], Int8Array>();
	return member(
		StructC,
		name,
		byteOffset,
		count,
		null,
		'i8a',
		function (): Int8Array {
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
		function (value: Int8Array): void {
			assignView(this[name] as Int8Array, value);
		},
	);
}

/**
 * Member uint8 array.
 *
 * @param count Array length.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberU8A<C extends typeof Struct>(
	count: number,
	StructC: C,
	name: MembersExtends<C, Uint8Array>,
	byteOffset: number,
): number {
	const m = new WeakMap<C['prototype'], Uint8Array>();
	return member(
		StructC,
		name,
		byteOffset,
		count,
		null,
		'u8a',
		function (): Uint8Array {
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
		function (value: Uint8Array): void {
			assignView(this[name] as Uint8Array, value);
		},
	);
}
