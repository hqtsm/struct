import type { KeyofType } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member int32.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI32<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], number>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): number {
			return this.dataView.getInt32(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt32(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 4;
}

/**
 * Member uint32.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU32<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], number>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): number {
			return this.dataView.getUint32(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint32(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 4;
}
