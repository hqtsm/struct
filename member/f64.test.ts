import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberF64 } from './f64.ts';

Deno.test('memberF64', () => {
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
		class Test extends Struct {
			declare public readonly ['constructor']: typeof Test;

			declare public alpha: number;

			declare public beta: number;

			declare public gamma: number;

			public static override readonly BYTE_LENGTH: number = ((o) => {
				o += memberF64(this, 'alpha', o, true);
				o += memberF64(this, 'beta', o, false);
				o += memberF64(this, 'gamma', o);
				return o;
			})(super.BYTE_LENGTH);
		}

		assertEquals(Test.BYTE_LENGTH, 24);

		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		{
			const test = new Test(data.buffer, 0, false);
			test.alpha = f64;
			test.beta = f64;
			test.gamma = f64;

			assertEquals(test.alpha, f64);
			assertEquals(test.beta, f64);
			assertEquals(test.gamma, f64);
			assertEquals(view.getFloat64(0, true), f64);
			assertEquals(view.getFloat64(8, false), f64);
			assertEquals(view.getFloat64(16, false), f64);
		}
		{
			const test = new Test(data.buffer, 0, true);
			test.alpha = f64;
			test.beta = f64;
			test.gamma = f64;

			assertEquals(test.alpha, f64);
			assertEquals(test.beta, f64);
			assertEquals(test.gamma, f64);
			assertEquals(view.getFloat64(0, true), f64);
			assertEquals(view.getFloat64(8, false), f64);
			assertEquals(view.getFloat64(16, true), f64);
		}
	}
});
