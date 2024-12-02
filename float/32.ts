import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: float32.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function float32<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 4,
		get(): number {
			return dataView(this.buffer).getFloat32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setFloat32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Pointer: float32.
 */
export class Float32Ptr extends Ptr<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Float32Ptr, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 4;
}
