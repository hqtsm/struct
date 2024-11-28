import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';
import { assertEquals } from '@std/assert';

import type { ArrayBufferReal } from '../../type.ts';
import { dataView } from '../../util.ts';
import { ArrayFloat16 } from './16.ts';

function round(n: number): number {
	const dataView = new DataView(new ArrayBuffer(2));
	setFloat16(dataView, 0, n);
	return getFloat16(dataView, 0);
}

class ArrayFloat16M extends ArrayFloat16 {
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		length = 0,
		littleEndian: boolean | null = null,
	) {
		super(buffer, byteOffset, length, littleEndian);
		Object.defineProperty(dataView(this.buffer), 'getFloat16', {
			configurable: true,
			enumerable: false,
			value: function (
				this: DataView,
				offset: number,
				littleEndian?: boolean,
			): number {
				return getFloat16(this, offset, littleEndian);
			},
			writable: true,
		});
		Object.defineProperty(dataView(this.buffer), 'setFloat16', {
			configurable: true,
			enumerable: false,
			value: function (
				this: DataView,
				offset: number,
				value: number,
				littleEndian?: boolean,
			): void {
				setFloat16(this, offset, value, littleEndian);
			},
			writable: true,
		});
	}
}

class ArrayFloat16F extends ArrayFloat16 {
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		length = 0,
		littleEndian: boolean | null = null,
	) {
		super(buffer, byteOffset, length, littleEndian);
		Object.defineProperty(dataView(this.buffer), 'getFloat16', {
			configurable: true,
			enumerable: false,
			value: null,
			writable: true,
		});
		Object.defineProperty(dataView(this.buffer), 'setFloat16', {
			configurable: true,
			enumerable: false,
			value: null,
			writable: true,
		});
	}
}

Deno.test('ArrayFloat16', () => {
	const count = 3;
	const bpe = ArrayFloat16.BYTES_PER_ELEMENT;
	assertEquals(bpe, 2);
	assertEquals(ArrayFloat16.KIND, 'float');
	assertEquals(ArrayFloat16.SIGNED, true);
	assertEquals(ArrayFloat16.TYPE, Number);
	assertEquals(ArrayFloat16.MEMBERS[2], {
		byteOffset: 4,
		byteLength: 2,
		littleEndian: null,
		kind: 'float',
		signed: true,
		Type: Number,
	});

	const fA = round(Math.PI);
	const fB = round(-Math.E);

	for (const ArrayFloat16 of [ArrayFloat16M, ArrayFloat16F]) {
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + 1);
			const view = new DataView(buffer, 1);
			const a = new ArrayFloat16(buffer, 1, count, littleEndian);
			const le = a.littleEndian;
			for (let i = 0; i < count; i++) {
				a[i] = fA;
				assertEquals(getFloat16(view, i * bpe, le), fA);
				setFloat16(view, i * bpe, fB, le);
				assertEquals(a[i], fB);
			}
		}
	}
});
