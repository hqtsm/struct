import { assertEquals } from '@std/assert';

import {
	byteLength,
	byteOffset,
	getKind,
	getSigned,
	getType,
	littleEndian,
} from '../macro.ts';
import { Struct } from '../struct.ts';

import { float64 } from './64.ts';

Deno.test('float64', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

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
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 24);
	assertEquals(byteLength(Test, 'alpha'), 8);
	assertEquals(byteLength(Test, 'beta'), 8);
	assertEquals(byteLength(Test, 'gamma'), 8);
	assertEquals(littleEndian(Test, 'alpha'), true);
	assertEquals(littleEndian(Test, 'beta'), false);
	assertEquals(littleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getType(Test, 'gamma'), Number);
	assertEquals(getKind(Test, 'alpha'), 'float');
	assertEquals(getKind(Test, 'beta'), 'float');
	assertEquals(getKind(Test, 'gamma'), 'float');
	assertEquals(getSigned(Test, 'alpha'), true);
	assertEquals(getSigned(Test, 'beta'), true);
	assertEquals(getSigned(Test, 'gamma'), true);

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
