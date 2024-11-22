import { defineMember } from '../../member.ts';
import type { MembersExtends, Struct } from '../../struct.ts';

/**
 * Member: float32.
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
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 4,
		littleEndian,
		Type: 'f32',
		get(): number {
			return this.dataView.getFloat32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			this.dataView.setFloat32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
