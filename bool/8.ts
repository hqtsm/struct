import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { constant, dataView } from '../util.ts';

/**
 * Member: bool8.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
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

	static {
		constant(this.prototype, Symbol.toStringTag, 'Bool8Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
