import { dataView } from '../../util.ts';

import { ArrayTyped } from '../typed.ts';

/**
 * Array: float64.
 */
export class ArrayFloat64 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getFloat64(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat64(
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 8;
}
