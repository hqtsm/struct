import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
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

/**
 * Pointer: bool8.
 */
export class Bool8Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool8Ptr, 'new'>;

	protected override [Ptr.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	protected override [Ptr.setter](index: number, value: boolean): void {
		dataView(this.buffer).setInt8(this.byteOffset + index, value ? 1 : 0);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}
