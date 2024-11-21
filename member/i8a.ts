import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { memberView } from '../view.ts';

/**
 * Member int8 array.
 *
 * @param count Array length.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int8A<C extends typeof Struct>(
	count: number,
	StructC: C,
	name: MembersExtends<C['prototype'], Int8Array>,
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
export function uint8A<C extends typeof Struct>(
	count: number,
	StructC: C,
	name: MembersExtends<C['prototype'], Uint8Array>,
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
	);
}

/**
 * Member uint8 array clamped.
 *
 * @param count Array length.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint8AC<C extends typeof Struct>(
	count: number,
	StructC: C,
	name: MembersExtends<C['prototype'], Uint8ClampedArray>,
	byteOffset: number,
): number {
	return memberView(
		StructC,
		name,
		byteOffset,
		count,
		null,
		Uint8ClampedArray,
		function (): Uint8ClampedArray {
			return new Uint8ClampedArray(
				this.buffer,
				this.byteOffset + byteOffset,
				count,
			);
		},
	);
}
