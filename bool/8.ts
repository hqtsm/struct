import { defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool8.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteLength: 1,
		byteOffset,
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

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt8(this.byteOffset + index, value ? 1 : 0);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}
