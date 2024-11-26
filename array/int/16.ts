import { dataView } from '../../util.ts';

import { ArrayTyped } from '../typed.ts';

/**
 * Array: int16.
 */
export class ArrayInt16 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getInt16(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setInt16(
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 2;
}

/**
 * Array: uint16.
 */
export class ArrayUint16 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return dataView(this.buffer).getUint16(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		dataView(this.buffer).setUint16(
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 2;
}
