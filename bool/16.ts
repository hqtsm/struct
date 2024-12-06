import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
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
export function bool16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, boolean>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
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

/**
 * Pointer: bool16.
 */
export class Bool16Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16Ptr, 'new'>;

	protected override [Ptr.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	protected override [Ptr.setter](index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: bool16, big endian.
 */
export class Bool16BEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16BEPtr, 'new'>;

	protected override [Ptr.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
		);
	}

	protected override [Ptr.setter](index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: bool16, little endian.
 */
export class Bool16LEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16LEPtr, 'new'>;

	protected override [Ptr.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			true,
		);
	}

	protected override [Ptr.setter](index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;
}
