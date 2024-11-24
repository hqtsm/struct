import { defineMember } from '../member.ts';
import type { MembersExtends, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: float64.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float64<T extends TypeClass>(
	Type: T,
	name: MembersExtends<T['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 8,
		littleEndian,
		kind: 'float',
		signed: true,
		Type: Number,
		get(): number {
			return dataView(this.buffer).getFloat64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setFloat64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
