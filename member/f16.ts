import { getFloat16, setFloat16 } from '@hqtsm/dataview/f16';

import type { MembersExtends } from '../type.ts';
import type { Struct } from '../struct.ts';
import { member } from '../member.ts';

/**
 * Member float16.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberF16<C extends typeof Struct>(
	StructC: C,
	name: MembersExtends<C, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get(this: C['prototype']): number {
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
		set(this: C['prototype'], value: number): void {
			const { dataView } = this as unknown as {
				dataView: DataView & {
					setFloat16?: (
						byteOffset: number,
						value: number,
						littleEndian?: boolean,
					) => number;
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
	return member(StructC, name, byteOffset, 2, littleEndian, 'f16');
}
