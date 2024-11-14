import type { ReadonlyKeyofType } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member struct.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param Type Struct type.
 * @returns Byte length.
 */
export function memberStruct<
	T extends typeof Struct,
	U extends ReadonlyKeyofType<T, typeof Struct>,
>(
	StructT: T,
	offset: number,
	field: ReadonlyKeyofType<
		T['prototype'],
		T[U] extends typeof Struct ? T[U]['prototype'] : never
	>,
	Type: U,
): number {
	const StructC = StructT[Type] as typeof Struct;
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): T['prototype'] {
			return new StructC(
				this.buffer,
				this.byteOffset + offset,
				this.littleEndian,
			);
		},
	});
	return StructC.BYTE_LENGTH;
}
