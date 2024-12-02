import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: float64.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float64<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 8,
		get(): number {
			return dataView(this.buffer).getFloat64(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setFloat64(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Pointer: float64.
 */
export class Float64Ptr extends Ptr<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Float64Ptr, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * 8,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * 8,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 8;
}
