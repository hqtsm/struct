import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: int8.
 */
export class ArrayInt8 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getInt8(
			this.byteOffset + index * this.bytesPerElement,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setInt8(
			this.byteOffset + index * this.bytesPerElement,
			value,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 1;
}

/**
 * Array: uint8.
 */
export class ArrayUint8 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getUint8(
			this.byteOffset + index * this.bytesPerElement,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setUint8(
			this.byteOffset + index * this.bytesPerElement,
			value,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 1;
}
