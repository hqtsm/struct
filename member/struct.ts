import type { ReadonlyMembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

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
	name: ReadonlyMembersExtends<C, M['prototype']>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<C['prototype'], M['prototype']>();
	return member(
		StructC,
		name,
		byteOffset,
		StructM.BYTE_LENGTH,
		littleEndian,
		StructM,
		function (): M['prototype'] {
			let r = m.get(this);
			if (!r) {
				r = new StructM(
					this.buffer,
					this.byteOffset + byteOffset,
					littleEndian ?? this.littleEndian,
				);
				m.set(this, r);
			}
			return r;
		},
	);
}
