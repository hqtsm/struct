import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';
import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import type { ArrayBufferReal } from '../type.ts';
import {
	dataView,
	getByteLength,
	getByteOffset,
	getLittleEndian,
	getType,
} from '../util.ts';
import { float16, Float16Ptr } from './16.ts';

function round(n: number): number {
	const dataView = new DataView(new ArrayBuffer(2));
	setFloat16(dataView, 0, n);
	return getFloat16(dataView, 0);
}

Deno.test('float16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += float16(this, 'alpha', o, true);
			o += float16(this, 'beta', o, false);
			o += float16(this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestM extends Test {
		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
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

	class TestF extends Test {
		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
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

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 2);
	assertEquals(getByteLength(Test, 'gamma'), 2);
	assertEquals(getLittleEndian(Test, 'alpha'), true);
	assertEquals(getLittleEndian(Test, 'beta'), false);
	assertEquals(getLittleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), 'float16');
	assertEquals(getType(Test, 'beta'), 'float16');
	assertEquals(getType(Test, 'gamma'), 'float16');

	const v = new DataView(new ArrayBuffer(4));
	for (
		const f64 of [
			0,
			1,
			-1,
			Math.PI,
			-Math.PI,
			Math.E,
			-Math.E,
			Number.EPSILON,
			-Number.EPSILON,
			Number.MAX_SAFE_INTEGER,
			Number.MIN_SAFE_INTEGER,
			Number.MAX_VALUE,
			Number.MIN_VALUE,
			Infinity,
			-Infinity,
			NaN,
		]
	) {
		setFloat16(v, 0, f64, true);
		const f16 = getFloat16(v, 0, true);

		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		for (const Test of [TestM, TestF]) {
			const test = new Test(data.buffer, 0, false);
			test.alpha = f16;
			test.beta = f16;
			test.gamma = f16;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f16);
			assertEquals(test.beta, f16);
			assertEquals(test.gamma, f16);
			assertEquals(getFloat16(view, off.alpha, true), f16);
			assertEquals(getFloat16(view, off.beta, false), f16);
			assertEquals(getFloat16(view, off.gamma, false), f16);
		}
		for (const Test of [TestM, TestF]) {
			const test = new Test(data.buffer, 0, true);
			test.alpha = f16;
			test.beta = f16;
			test.gamma = f16;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f16);
			assertEquals(test.beta, f16);
			assertEquals(test.gamma, f16);
			assertEquals(getFloat16(view, off.alpha, true), f16);
			assertEquals(getFloat16(view, off.beta, false), f16);
			assertEquals(getFloat16(view, off.gamma, true), f16);
		}
	}
});

class Float16PtrM extends Float16Ptr {
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		super(buffer, byteOffset, littleEndian);
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

class Float16PtrF extends Float16Ptr {
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		super(buffer, byteOffset, littleEndian);
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

Deno.test('Float16Ptr', () => {
	const bpe = Float16Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 2);

	const fA = round(Math.PI);
	const fB = round(-Math.E);

	const count = 3;
	for (const Float16Ptr of [Float16PtrM, Float16PtrF]) {
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Float16Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = fA;
				assertEquals(getFloat16(view, o, ptr.littleEndian), fA);
				setFloat16(view, o, fB, ptr.littleEndian);
				assertEquals(ptr[i], fB);
			}
		}
	}
});
