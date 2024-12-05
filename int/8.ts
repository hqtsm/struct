import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int8.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function int8<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
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
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function uint8<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 1,
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

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getInt8(this.byteOffset + index);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setInt8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}

/**
 * Pointer: uint8.
 */
export class Uint8Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint8Ptr, 'new'>;

	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getUint8(this.byteOffset + index);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setUint8(this.byteOffset + index, value);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}
