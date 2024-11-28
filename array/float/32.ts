import type { MemberInfoSigned, MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: float32.
 */
export class ArrayFloat32 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayFloat32, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat32(
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
