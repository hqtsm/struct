import type { MembersExtends, Struct } from '../../struct.ts';
import { memberValue } from '../../value.ts';

/**
 * Member float64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float64<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		8,
		littleEndian,
		'f64',
		function (): number {
			return this.dataView.getFloat64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setFloat64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
