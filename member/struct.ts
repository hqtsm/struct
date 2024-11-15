import type { ReadonlyKeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member struct.
 *
 * @param StructM Member struct.
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @returns Byte length.
 */
export function memberStruct<M extends typeof Struct, T extends typeof Struct>(
	StructM: M,
	StructT: T,
	offset: number,
	member: ReadonlyKeyofExtends<T['prototype'], M['prototype']>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): M['prototype'] {
			return new StructM(
				this.buffer,
				this.byteOffset + offset,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return StructM.BYTE_LENGTH;
}
