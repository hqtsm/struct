import type { MemberInfoSigned, MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: int32.
 */
export class ArrayInt32 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayInt32, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 4;

	/**
	 * @inheritdoc
	 */
	public static override readonly KIND: string = 'int';

	/**
	 * @inheritdoc
	 */
	public static override readonly SIGNED: MemberInfoSigned = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = Number;
}

/**
 * Array: uint32.
 */
export class ArrayUint32 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayUint32, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 4;

	/**
	 * @inheritdoc
	 */
	public static override readonly KIND: string = 'int';

	/**
	 * @inheritdoc
	 */
	public static override readonly SIGNED: MemberInfoSigned = false;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = Number;
}
