import { defineMember } from '../member.ts';
import type { Membered, MembersExtends } from '../struct.ts';

/**
 * Member: float64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float64<C extends Membered>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 8,
		littleEndian,
		kind: 'float',
		signed: true,
		Type: Number,
		get(): number {
			return this.dataView.getFloat64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setFloat64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
