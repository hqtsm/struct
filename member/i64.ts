import type { KeyofExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int64.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI64<T extends typeof Struct>(
	StructT: T,
	name: KeyofExtends<T['prototype'], bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigInt64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigInt64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, 8, littleEndian);
}

/**
 * Member uint64.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU64<T extends typeof Struct>(
	StructT: T,
	name: KeyofExtends<T['prototype'], bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, name, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigUint64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigUint64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructT, name, byteOffset, 8, littleEndian);
}
