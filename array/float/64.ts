import type { MemberInfoSigned, MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: float64.
 */
export class ArrayFloat64 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayFloat64, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 8;

	/**
	 * @inheritdoc
	 */
	public static override readonly KIND: string = 'float';

	/**
	 * @inheritdoc
	 */
	public static override readonly SIGNED: MemberInfoSigned = true;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = Number;
}
