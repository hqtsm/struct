import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member float32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberF32<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
			return this.dataView.getFloat32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: number): void {
			this.dataView.setFloat32(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 4, littleEndian, 'f32');
}
