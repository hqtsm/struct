import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { assignView } from '../macro.ts';

import { memberView } from './view.ts';

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
	return memberView(
		StructC,
		name,
		byteOffset,
		count,
		null,
		Int8Array,
		function (): Int8Array {
			return new Int8Array(
				this.buffer,
				this.byteOffset + byteOffset,
				count,
			);
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
	return memberView(
		StructC,
		name,
		byteOffset,
		count,
		null,
		Uint8Array,
		function (): Uint8Array {
			return new Uint8Array(
				this.buffer,
				this.byteOffset + byteOffset,
				count,
			);
		},
		function (value: Uint8Array): void {
			assignView(this[name] as Uint8Array, value);
		},
	);
}
