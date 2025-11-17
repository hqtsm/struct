/**
 * @module
 *
 * 16-bit float.
 */

import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';
import { type Class, constant, toStringTag } from '@hqtsm/class';
import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

type MaybeNativeFloat16 = Partial<{
	getFloat16(byteOffset: number, littleEndian?: boolean): number;
	setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
}>;

/**
 * Member: float16.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function float16<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		2,
		byteOffset,
		function (): number {
			const d = dataView(this.buffer) as MaybeNativeFloat16;
			return d.getFloat16
				? d.getFloat16(
					this.byteOffset + byteOffset,
					littleEndian ?? this.littleEndian,
				)
				: getFloat16(
					d as DataView,
					this.byteOffset + byteOffset,
					littleEndian ?? this.littleEndian,
				);
		},
		function (value: number): void {
			const d = dataView(this.buffer) as MaybeNativeFloat16;
			if (d.setFloat16) {
				d.setFloat16(
					this.byteOffset + byteOffset,
					value,
					littleEndian ?? this.littleEndian,
				);
			} else {
				setFloat16(
					d as DataView,
					this.byteOffset + byteOffset,
					value,
					littleEndian ?? this.littleEndian,
				);
			}
		},
	);
}

/**
 * Member: float16, big endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float16BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float16(Type, name, byteOffset, false);
}

/**
 * Member: float16, little endian.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float16LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float16(Type, name, byteOffset, true);
}

/**
 * Pointer: float16.
 */
export class Float16Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Class<typeof Float16Ptr>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		return d.getFloat16
			? d.getFloat16(
				this.byteOffset + index * 2,
				this.littleEndian,
			)
			: getFloat16(
				d as DataView,
				this.byteOffset + index * 2,
				this.littleEndian,
			);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		if (d.setFloat16) {
			d.setFloat16(
				this.byteOffset + index * 2,
				value,
				this.littleEndian,
			);
		} else {
			setFloat16(
				d as DataView,
				this.byteOffset + index * 2,
				value,
				this.littleEndian,
			);
		}
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Float16Ptr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float16, big endian.
 */
export class Float16BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Class<typeof Float16BEPtr>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		return d.getFloat16
			? d.getFloat16(
				this.byteOffset + index * 2,
			)
			: getFloat16(
				d as DataView,
				this.byteOffset + index * 2,
			);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		if (d.setFloat16) {
			d.setFloat16(
				this.byteOffset + index * 2,
				value,
			);
		} else {
			setFloat16(
				d as DataView,
				this.byteOffset + index * 2,
				value,
			);
		}
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Float16BEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}

/**
 * Pointer: float16, little endian.
 */
export class Float16LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Class<typeof Float16LEPtr>;

	public override get(index: number): number {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		return d.getFloat16
			? d.getFloat16(
				this.byteOffset + index * 2,
				true,
			)
			: getFloat16(
				d as DataView,
				this.byteOffset + index * 2,
				true,
			);
	}

	public override set(index: number, value: number): void {
		index = (+index || 0) - (index % 1 || 0);
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		if (d.setFloat16) {
			d.setFloat16(
				this.byteOffset + index * 2,
				value,
				true,
			);
		} else {
			setFloat16(
				d as DataView,
				this.byteOffset + index * 2,
				value,
				true,
			);
		}
	}

	public static override readonly BYTES_PER_ELEMENT: number = 2;

	static {
		toStringTag(this, 'Float16LEPtr');
		constant(this, 'BYTES_PER_ELEMENT');
	}
}
