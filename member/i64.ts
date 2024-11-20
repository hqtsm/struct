import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member int64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI64<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): bigint {
			return this.dataView.getBigInt64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: bigint): void {
			this.dataView.setBigInt64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 8, littleEndian, 'i64');
}

/**
 * Member uint64.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU64<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, bigint>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): bigint {
			return this.dataView.getBigUint64(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(this: C['prototype'], value: bigint): void {
			this.dataView.setBigUint64(
				byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
	return member(StructC, name, byteOffset, 8, littleEndian, 'u64');
}
