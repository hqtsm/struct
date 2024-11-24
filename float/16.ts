import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';

import { defineMember } from '../member.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

type MaybeNativeFloat16 = Partial<{
	getFloat16(byteOffset: number, littleEndian?: boolean): number;
	setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
}>;

/**
 * Member: float16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		kind: 'float',
		signed: true,
		Type: Number,
		get(): number {
			const d = dataView(this.buffer) as MaybeNativeFloat16;
			return d.getFloat16
				? d.getFloat16(
					this.byteOffset + byteOffset,
					littleEndian ?? this.littleEndian,
				)
				: getFloat16(
					d as DataView,
					byteOffset,
					littleEndian ?? this.littleEndian,
				);
		},
		set(value: number): void {
			const d = dataView(this.buffer) as MaybeNativeFloat16;
			if (d.setFloat16) {
				d.setFloat16(
					byteOffset,
					value,
					littleEndian ?? this.littleEndian,
				);
			} else {
				setFloat16(
					d as DataView,
					byteOffset,
					value,
					littleEndian ?? this.littleEndian,
				);
			}
		},
	});
}
