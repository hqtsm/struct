import type { MemberInfoType } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

/**
 * Array: int64.
 */
export class ArrayInt64 extends ArrayTyped<bigint> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayInt64, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): bigint {
		return dataView(this.buffer).getBigInt64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigInt64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 8;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = 'int64';
}

/**
 * Array: uint64.
 */
export class ArrayUint64 extends ArrayTyped<bigint> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayUint64, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): bigint {
		return dataView(this.buffer).getBigUint64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: bigint): void {
		dataView(this.buffer).setBigUint64(
			this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
			value,
			this.littleEndian,
		);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 8;

	/**
	 * @inheritdoc
	 */
	public static override readonly TYPE: MemberInfoType = 'uint64';
}
