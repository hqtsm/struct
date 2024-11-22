import { defineMember } from '../member.ts';
import type { MembersExtends, Struct } from '../struct.ts';

/**
 * Member: bool8.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool8<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], boolean>,
	byteOffset: number,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		kind: 'bool',
		signed: null,
		Type: Boolean,
		get(): boolean {
			return !!this.dataView.getInt8(byteOffset);
		},
		set(value: boolean): void {
			this.dataView.setInt8(byteOffset, value ? 1 : 0);
		},
	});
}
