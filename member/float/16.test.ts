import { assertEquals } from '@std/assert';
import { getFloat16, setFloat16 } from '@hqtsm/dataview/f16';

import type { ArrayBufferReal } from '../../type.ts';
import { byteLength, byteOffset, getType, littleEndian } from '../../macro.ts';
import { Struct } from '../../struct.ts';

import { float16 } from './16.ts';

Deno.test('float16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

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
		declare public readonly ['constructor']: typeof TestM;

		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
			Object.defineProperty(this.dataView, 'getFloat16', {
				value: function (
					this: DataView,
					offset: number,
					littleEndian?: boolean,
				): number {
					return getFloat16(this, offset, littleEndian);
				},
			});
			Object.defineProperty(this.dataView, 'setFloat16', {
				value: function (
					this: DataView,
					offset: number,
					value: number,
					littleEndian?: boolean,
				): void {
					setFloat16(this, offset, value, littleEndian);
				},
			});
		}
	}

	class TestF extends Test {
		declare public readonly ['constructor']: typeof TestF;

		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
			Object.defineProperty(this.dataView, 'getFloat16', {
				value: null,
			});
			Object.defineProperty(this.dataView, 'setFloat16', {
				value: null,
			});
		}
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(byteLength(Test, 'alpha'), 2);
	assertEquals(byteLength(Test, 'beta'), 2);
	assertEquals(byteLength(Test, 'gamma'), 2);
	assertEquals(littleEndian(Test, 'alpha'), true);
	assertEquals(littleEndian(Test, 'beta'), false);
	assertEquals(littleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), 'f16');
	assertEquals(getType(Test, 'beta'), 'f16');
	assertEquals(getType(Test, 'gamma'), 'f16');

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
