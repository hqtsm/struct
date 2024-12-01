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
		byteOffset,
		byteLength: 4,
		littleEndian,
		type: 'bool32',
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
 * Pointer: bool32.
 */
export class Bool32Ptr extends Ptr<boolean> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Bool32Ptr, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.setter](index: number, value: boolean): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 4;
}
