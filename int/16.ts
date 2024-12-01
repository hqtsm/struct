import { defineMember } from '../member.ts';
import { Ptr } from '../ptr.ts';
import type { MembersExtends, Type, TypeClass } from '../type.ts';
import { dataView } from '../util.ts';

/**
 * Member: int16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function int16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		type: 'int16',
		get(): number {
			return dataView(this.buffer).getInt16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setInt16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint16.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function uint16<T extends Type>(
	Type: TypeClass<T>,
	name: MembersExtends<T, number>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength: 2,
		littleEndian,
		type: 'uint16',
		get(): number {
			return dataView(this.buffer).getUint16(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setUint16(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Pointer: int16.
 */
export class Int16Ptr extends Ptr<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Int16Ptr, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Pointer: uint16.
 */
export class Uint16Ptr extends Ptr<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Uint16Ptr, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.getter](index: number): number {
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * 2,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [Ptr.setter](index: number, value: number): void {
		dataView(this.buffer).setUint16(
			this.byteOffset + index * 2,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 2;
}
