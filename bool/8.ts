import { defineMember } from '../member.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool8.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool8<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, boolean>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
		littleEndian: null,
		type: 'bool8',
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
