import { defineMember } from '../member.ts';
import type { Membered, MembersExtends } from '../struct.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function bool32<C extends Membered>(
	StructC: C,
	name: MembersExtends<C['prototype'], boolean>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 4,
		littleEndian,
		kind: 'bool',
		signed: null,
		Type: Boolean,
		get(): boolean {
			return !!dataView(this.buffer).getInt32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: boolean): void {
			dataView(this.buffer).setInt32(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
