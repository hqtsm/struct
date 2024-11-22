import { defineMember } from '../member.ts';
import type { Membered, MembersExtends } from '../struct.ts';

/**
 * Member: bool16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function bool16<C extends Membered>(
	StructC: C,
	name: MembersExtends<C['prototype'], boolean>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		kind: 'bool',
		signed: null,
		Type: Boolean,
		get(): boolean {
			return !!this.dataView.getInt16(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: boolean): void {
			this.dataView.setInt16(
				byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
