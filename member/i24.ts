import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { getInt24, getUint24, setInt24, setUint24 } from '../util.ts';

/**
 * Member int24.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param name Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI24<T extends typeof Struct>(
	StructT: T,
	offset: number,
	name: KeyofExtends<T['prototype'], number>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return getInt24(
				this.dataView,
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			setInt24(
				this.dataView,
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 3;
}

/**
 * Member uint24.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param name Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU24<T extends typeof Struct>(
	StructT: T,
	offset: number,
	name: KeyofExtends<T['prototype'], number>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): number {
			return getUint24(
				this.dataView,
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			setUint24(
				this.dataView,
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 3;
}
