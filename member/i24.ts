import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { getInt24, getUint24, setInt24, setUint24 } from '../dataview/i24.ts';
import { member } from '../member.ts';

/**
 * Member int24.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI24<T extends typeof Struct>(
	StructT: T,
	name: Exclude<KeyofExtends<T['prototype'], number>, keyof Struct>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return getInt24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			setInt24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, 3, littleEndian, 'i24');
}

/**
 * Member uint24.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU24<T extends typeof Struct>(
	StructT: T,
	name: Exclude<KeyofExtends<T['prototype'], number>, keyof Struct>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return getUint24(
				this.dataView,
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			setUint24(
				this.dataView,
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, 3, littleEndian, 'u24');
}
