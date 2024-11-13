import type { KeyofType } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Member int64.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI64<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], bigint>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigInt64(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigInt64(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 8;
}

/**
 * Member uint64.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param member Member name.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU64<T extends typeof Struct>(
	StructT: T,
	offset: number,
	member: KeyofType<T['prototype'], bigint>,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, member, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigUint64(
				offset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigUint64(
				offset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return 8;
}
