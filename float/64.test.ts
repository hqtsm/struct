import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import { float64, Float64Ptr } from './64.ts';

Deno.test('float64', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += float64(this, 'alpha', o, true);
			o += float64(this, 'beta', o, false);
			o += float64(this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 24);
	assertEquals(getByteLength(Test, 'alpha'), 8);
	assertEquals(getByteLength(Test, 'beta'), 8);
	assertEquals(getByteLength(Test, 'gamma'), 8);

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
		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		{
			const test = new Test(data.buffer, 0, false);
			test.alpha = f64;
			test.beta = f64;
			test.gamma = f64;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f64);
			assertEquals(test.beta, f64);
			assertEquals(test.gamma, f64);
			assertEquals(view.getFloat64(off.alpha, true), f64);
			assertEquals(view.getFloat64(off.beta, false), f64);
			assertEquals(view.getFloat64(off.gamma, false), f64);
		}
		{
			const test = new Test(data.buffer, 0, true);
			test.alpha = f64;
			test.beta = f64;
			test.gamma = f64;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f64);
			assertEquals(test.beta, f64);
			assertEquals(test.gamma, f64);
			assertEquals(view.getFloat64(off.alpha, true), f64);
			assertEquals(view.getFloat64(off.beta, false), f64);
			assertEquals(view.getFloat64(off.gamma, true), f64);
		}
	}
});

Deno.test('Float64Ptr', () => {
	const bpe = Float64Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 8);

	const fA = Math.PI;
	const fB = -Math.E;

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Float64Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = fA;
			assertEquals(view.getFloat64(o, ptr.littleEndian), fA);
			view.setFloat64(o, fB, ptr.littleEndian);
			assertEquals(ptr[i], fB);
		}
	}
});
