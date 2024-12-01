import type { MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: bool32.
 */
export class ArrayBool32 extends ArrayTyped<boolean> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayBool32, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](
		index: number,
		value: boolean,
	): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value ? 1 : 0,
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
	public static override readonly TYPE: MemberInfoType = 'bool32';
}
