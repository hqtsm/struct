import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { memberValue } from '../value.ts';

/**
 * Member float32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return memberValue(
		StructC,
		name,
		byteOffset,
		4,
		littleEndian,
		'f32',
		function (): number {
			return this.dataView.getFloat32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		function (value: number): void {
			this.dataView.setFloat32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	);
}
