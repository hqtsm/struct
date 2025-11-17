/**
 * @module
 *
 * 8-bit boolean.
 */

import { type Class, constant, toStringTag } from '@hqtsm/class';
import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool8.
 *
 * @template T Type class.
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
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		1,
		byteOffset,
		function (): boolean {
			return !!dataView(this.buffer).getInt8(
				this.byteOffset + byteOffset,
			);
		},
		function (value: boolean): void {
			dataView(this.buffer).setInt8(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
			);
		},
	);
}

/**
 * Pointer: bool8.
 */
export class Bool8Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Class<typeof Bool8Ptr>;

	public override get(index: number): boolean {
		index = (+index || 0) - (index % 1 || 0);
		return !!dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	public override set(index: number, value: boolean): void {
		index = (+index || 0) - (index % 1 || 0);
		dataView(this.buffer).setInt8(this.byteOffset + index, value ? 1 : 0);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;

	static {
		toStringTag(this, 'Bool8Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
