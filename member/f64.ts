import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member float64.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberF64<T extends typeof Struct>(
	StructT: T,
	name: Exclude<KeyofExtends<T['prototype'], number>, keyof Struct>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getFloat64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setFloat64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, 8, littleEndian);
}
