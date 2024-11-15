import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member float64.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param offset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberF64<T extends typeof Struct>(
	StructT: T,
	name: KeyofExtends<T['prototype'], number>,
	offset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getFloat64(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setFloat64(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 8;
}
