import {
	getInt24,
	getUint24,
	setInt24,
	setUint24,
} from '@hqtsm/dataview/int/24';

import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: int24.
 */
export class ArrayInt24 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return getInt24(
			dataView(this.buffer),
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		setInt24(
			dataView(this.buffer),
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Array: uint24.
 */
export class ArrayUint24 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return getUint24(
			dataView(this.buffer),
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		setUint24(
			dataView(this.buffer),
			this.byteOffset + index * this.bytesPerElement,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 3;
}

/**
 * Array: int24, aligned to 4 bytes.
 */
export class ArrayInt24Align4 extends ArrayInt24 {
	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 4;
}

/**
 * Array: uint24, aligned to 4 bytes.
 */
export class ArrayUint24Align4 extends ArrayUint24 {
	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 4;
}
