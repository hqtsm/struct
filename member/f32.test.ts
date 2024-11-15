import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberF32 } from './f32.ts';
import { byteLength, byteOffset, littleEndian } from '../macro.ts';

Deno.test('memberF32', () => {
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
		v.setFloat32(0, f64, true);
		const f32 = v.getFloat32(0, true);

		class Test extends Struct {
			declare public readonly ['constructor']: typeof Test;

			declare public alpha: number;

			declare public beta: number;

			declare public gamma: number;

			public static override readonly BYTE_LENGTH: number = ((o) => {
				o += memberF32(this, 'alpha', o, true);
				o += memberF32(this, 'beta', o, false);
				o += memberF32(this, 'gamma', o);
				return o;
			})(super.BYTE_LENGTH);
		}

		const off = {
			alpha: byteOffset(Test, 'alpha'),
			beta: byteOffset(Test, 'beta'),
			gamma: byteOffset(Test, 'gamma'),
		};

		assertEquals(Test.BYTE_LENGTH, 12);
		assertEquals(byteLength(Test, 'alpha'), 4);
		assertEquals(byteLength(Test, 'beta'), 4);
		assertEquals(byteLength(Test, 'gamma'), 4);
		assertEquals(littleEndian(Test, 'alpha'), true);
		assertEquals(littleEndian(Test, 'beta'), false);
		assertEquals(littleEndian(Test, 'gamma'), null);

		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		{
			const test = new Test(data.buffer, 0, false);
			test.alpha = f32;
			test.beta = f32;
			test.gamma = f32;

			assertEquals(test.alpha, f32);
			assertEquals(test.beta, f32);
			assertEquals(test.gamma, f32);
			assertEquals(view.getFloat32(off.alpha, true), f32);
			assertEquals(view.getFloat32(off.beta, false), f32);
			assertEquals(view.getFloat32(off.gamma, false), f32);
		}
		{
			const test = new Test(data.buffer, 0, true);
			test.alpha = f32;
			test.beta = f32;
			test.gamma = f32;

			assertEquals(test.alpha, f32);
			assertEquals(test.beta, f32);
			assertEquals(test.gamma, f32);
			assertEquals(view.getFloat32(off.alpha, true), f32);
			assertEquals(view.getFloat32(off.beta, false), f32);
			assertEquals(view.getFloat32(off.gamma, true), f32);
		}
	}
});
