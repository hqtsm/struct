import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool16.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function bool16<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	return defineMember(Type, name, {
		byteLength: 2,
		byteOffset,
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
 * Member: bool16, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool16BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool16(Type, name, byteOffset, false);
}

/**
 * Member: bool16, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function bool16LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, boolean>,
	byteOffset: number | null = null,
): number {
	return bool16(Type, name, byteOffset, true);
}

/**
 * Pointer: bool16.
 */
export class Bool16Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16Ptr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Bool16Ptr',
		});
	}
}

/**
 * Pointer: bool16, big endian.
 */
export class Bool16BEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16BEPtr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Bool16BEPtr',
		});
	}
}

/**
 * Pointer: bool16, little endian.
 */
export class Bool16LEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool16LEPtr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			true,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value ? 1 : 0,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Bool16LEPtr',
		});
	}
}
