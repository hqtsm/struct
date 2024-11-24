import { defineMember } from '../member.ts';
import type { MembersExtends, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool8.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool8<T extends TypeClass>(
	Type: T,
	name: MembersExtends<T['prototype'], boolean>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		kind: 'bool',
		signed: null,
		Type: Boolean,
		get(): boolean {
			return !!dataView(this.buffer).getInt8(
				this.byteOffset + byteOffset,
			);
		},
		set(value: boolean): void {
			dataView(this.buffer).setInt8(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
			);
		},
	});
}
