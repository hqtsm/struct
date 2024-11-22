import { defineMember } from '../member.ts';
import type { MembersExtends, Struct } from '../struct.ts';

/**
 * Member: bool32.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function bool32<C extends typeof Struct>(
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
			return !!this.dataView.getInt32(
				byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: boolean): void {
			this.dataView.setInt32(
				byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
