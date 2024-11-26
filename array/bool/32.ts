import { dataView } from '../../util.ts';

import { ArrayTyped } from '../typed.ts';

/**
 * Array: bool32.
 */
export class ArrayBool32 extends ArrayTyped<boolean> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): boolean {
		return !!dataView(this.buffer).getInt32(
			this.byteOffset + index * this.bytesPerElement,
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
			this.byteOffset + index * this.bytesPerElement,
			value ? 1 : 0,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 4;
}
