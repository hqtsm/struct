import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';

import { dataView } from '../../util.ts';
import { ArrayTyped } from '../typed.ts';

type MaybeNativeFloat16 = Partial<{
	getFloat16(byteOffset: number, littleEndian?: boolean): number;
	setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
}>;

/**
 * Array: float16.
 */
export class ArrayFloat16 extends ArrayTyped<number> {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayFloat16, 'new'>;

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): number {
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		return d.getFloat16
			? d.getFloat16(
				this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
				this.littleEndian,
			)
			: getFloat16(
				d as DataView,
				this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
				this.littleEndian,
			);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: number): void {
		const d = dataView(this.buffer) as MaybeNativeFloat16;
		if (d.setFloat16) {
			d.setFloat16(
				this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
				value,
				this.littleEndian,
			);
		} else {
			setFloat16(
				d as DataView,
				this.byteOffset + index * this.constructor.BYTES_PER_ELEMENT,
				value,
				this.littleEndian,
			);
		}
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTES_PER_ELEMENT: number = 2;
}
