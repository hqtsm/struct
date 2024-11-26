import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: float32.
 */
export class ArrayFloat32 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 4;
}
