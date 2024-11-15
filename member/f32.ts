import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member float32.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberF32<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofExtends<T['prototype'], number>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): number {
			return this.dataView.getFloat32(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setFloat32(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 4;
}
