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
	declare public readonly ['constructor']: Omit<typeof ArrayInt24, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return getInt24(
			dataView(this.buffer),
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		setInt24(
			dataView(this.buffer),
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
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
	declare public readonly ['constructor']: Omit<typeof ArrayUint24, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		return getUint24(
			dataView(this.buffer),
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		setUint24(
			dataView(this.buffer),
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	static override readonly BYTES_PER_ELEMENT: number = 3;
}
