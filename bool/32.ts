import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: bool32.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function bool32<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, boolean>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteLength: 4,
		byteOffset,
		get(): boolean {
			return !!dataView(this.buffer).getInt32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: boolean): void {
			dataView(this.buffer).setInt32(
				this.byteOffset + byteOffset,
				value ? 1 : 0,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: bool32, big endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool32BE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, boolean>,
	byteOffset: number,
): number {
	return bool32(Type, name, byteOffset, false);
}

/**
 * Member: bool32, little endian.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function bool32LE<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, boolean>,
	byteOffset: number,
): number {
	return bool32(Type, name, byteOffset, true);
}

/**
 * Pointer: bool32.
 */
export class Bool32Ptr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool32Ptr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: bool32, big endian.
 */
export class Bool32BEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool32BEPtr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Pointer: bool32, little endian.
 */
export class Bool32LEPtr extends Ptr<boolean> {
	declare public readonly ['constructor']: Omit<typeof Bool32LEPtr, 'new'>;

	public override get(index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: boolean): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}
