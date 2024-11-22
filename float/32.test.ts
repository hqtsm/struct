import { assertEquals } from '@std/assert';

import {
	getByteLength,
	getByteOffset,
	getKind,
	getLittleEndian,
	getSigned,
	getType,
} from '../util.ts';
import { Struct } from '../struct.ts';

import { float32 } from './32.ts';

Deno.test('float32', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += float32(this, 'alpha', o, true);
			o += float32(this, 'beta', o, false);
			o += float32(this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 12);
	assertEquals(getByteLength(Test, 'alpha'), 4);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 4);
	assertEquals(getLittleEndian(Test, 'alpha'), true);
	assertEquals(getLittleEndian(Test, 'beta'), false);
	assertEquals(getLittleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getType(Test, 'gamma'), Number);
	assertEquals(getKind(Test, 'alpha'), 'float');
	assertEquals(getKind(Test, 'beta'), 'float');
	assertEquals(getKind(Test, 'gamma'), 'float');
	assertEquals(getSigned(Test, 'alpha'), true);
	assertEquals(getSigned(Test, 'beta'), true);
	assertEquals(getSigned(Test, 'gamma'), true);

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
		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		{
			const test = new Test(data.buffer, 0, false);
			test.alpha = f32;
			test.beta = f32;
			test.gamma = f32;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
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

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f32);
			assertEquals(test.beta, f32);
			assertEquals(test.gamma, f32);
			assertEquals(view.getFloat32(off.alpha, true), f32);
			assertEquals(view.getFloat32(off.beta, false), f32);
			assertEquals(view.getFloat32(off.gamma, true), f32);
		}
	}
});
