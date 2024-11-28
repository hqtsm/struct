import type { MemberInfoSigned, MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: bool8.
 */
export class ArrayBool8 extends ArrayTyped<boolean> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayBool8, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt8(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](
		index: number,
		value: boolean,
	): void {
		dataView(this.buffer).setInt8(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value ? 1 : 0,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 1;

	/**
	 * @inheritdoc
	 */
	public static override readonly KIND: string = 'bool';

	/**
	 * @inheritdoc
	 */
	public static override readonly SIGNED: MemberInfoSigned = null;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = Boolean;
}
