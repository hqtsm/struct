import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';

import type { MembersExtends, Struct } from '../struct.ts';
import { defineMember } from '../member.ts';

/**
 * Member: float16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C['prototype'], number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		Type: 'f16',
		get(): number {
			const { dataView } = this as unknown as {
				dataView: DataView & {
					getFloat16?: (
						byteOffset: number,
						littleEndian?: boolean,
					) => number;
				};
			};
			const le = littleEndian ?? this.littleEndian;
			return dataView.getFloat16
				? dataView.getFloat16(byteOffset, le)
				: getFloat16(dataView, byteOffset, le);
		},
		set(value: number): void {
			const { dataView } = this as unknown as {
				dataView: DataView & {
					setFloat16?: (
						byteOffset: number,
						value: number,
						littleEndian?: boolean,
					) => void;
				};
			};
			const le = littleEndian ?? this.littleEndian;
			if (dataView.setFloat16) {
				dataView.setFloat16(
					byteOffset,
					value,
					le,
				);
			} else {
				setFloat16(dataView, byteOffset, value, le);
			}
		},
	});
}
