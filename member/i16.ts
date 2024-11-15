import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member int16.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param offset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI16<T extends typeof Struct>(
	StructT: T,
	name: KeyofExtends<T['prototype'], number>,
	offset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getInt16(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt16(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 2;
}

/**
 * Member uint16.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param offset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU16<T extends typeof Struct>(
	StructT: T,
	name: KeyofExtends<T['prototype'], number>,
	offset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return this.dataView.getUint16(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint16(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 2;
}
