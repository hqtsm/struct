import { defineMember } from '../member.ts';
import type { MembersExtends, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function bool16<T extends TypeClass>(
	Type: T,
	name: MembersExtends<T['prototype'], boolean>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		kind: 'bool',
		signed: null,
		Type: Boolean,
		get(): boolean {
			return !!dataView(this.buffer).getInt16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: boolean): void {
			dataView(this.buffer).setInt16(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}
