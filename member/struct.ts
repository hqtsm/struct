import type { ReadonlyKeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member struct.
 *
 * @param StructM Member struct.
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param offset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberStruct<M extends typeof Struct, T extends typeof Struct>(
	StructM: M,
	StructT: T,
	name: ReadonlyKeyofExtends<T['prototype'], M['prototype']>,
	offset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
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
