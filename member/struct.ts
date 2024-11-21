import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { assignStruct } from '../macro.ts';

import { memberView } from './view.ts';

/**
 * Member struct.
 *
 * @param StructM Member struct.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberStruct<M extends typeof Struct, C extends typeof Struct>(
	StructM: M,
	StructC: C,
	name: MembersExtends<C, M['prototype']>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberView(
		StructC,
		name,
		byteOffset,
		StructM.BYTE_LENGTH,
		littleEndian,
		StructM,
		function (): M['prototype'] {
			return new StructM(
				this.buffer,
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: M['prototype']): void {
			assignStruct(this[name] as M['prototype'], value);
		},
	);
}
