import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: int8.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	return defineMember(Type, name, {
		byteLength: 1,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getInt8(this.byteOffset + byteOffset);
		},
		set(value: number): void {
			dataView(this.buffer).setInt8(this.byteOffset + byteOffset, value);
		},
	});
}

/**
 * Member: uint8.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function uint8<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	return defineMember(Type, name, {
		byteLength: 1,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getUint8(this.byteOffset + byteOffset);
		},
		set(value: number): void {
			dataView(this.buffer).setUint8(this.byteOffset + byteOffset, value);
		},
	});
}

/**
 * Pointer: int8.
 */
export class Int8Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int8Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Int8Ptr',
		});
	}
}

/**
 * Pointer: uint8.
 */
export class Uint8Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint8Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint8(this.byteOffset + index);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Uint8Ptr',
		});
	}
}
