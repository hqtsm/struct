import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: bool8.
 */
export class ArrayBool8 extends ArrayTyped<boolean> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt8(
			this.byteOffset + index * this.bytesPerElement,
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
			this.byteOffset + index * this.bytesPerElement,
			value ? 1 : 0,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 1;
}