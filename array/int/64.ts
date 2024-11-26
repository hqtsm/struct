import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: int64.
 */
export class ArrayInt64 extends ArrayTyped<bigint> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): bigint {
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigInt64(
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

/**
 * Array: uint64.
 */
export class ArrayUint64 extends ArrayTyped<bigint> {
	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): bigint {
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * this.bytesPerElement,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigUint64(
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
