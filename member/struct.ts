import type { ReadonlyKeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member struct.
 *
 * @param StructM Member struct.
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberStruct<M extends typeof Struct, T extends typeof Struct>(
	StructM: M,
	StructT: T,
	name: Exclude<
		ReadonlyKeyofExtends<T['prototype'], M['prototype']>,
		keyof Struct
	>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): M['prototype'] {
			return new StructM(
				this.buffer,
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, StructM.BYTE_LENGTH, littleEndian);
}
