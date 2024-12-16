import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import {
	float32,
	float32BE,
	Float32BEPtr,
	float32LE,
	Float32LEPtr,
	Float32Ptr,
} from './32.ts';

function round(n: number): number {
	const dataView = new DataView(new ArrayBuffer(4));
	dataView.setFloat32(0, n);
	return dataView.getFloat32(0);
}

Deno.test('float32', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		static {
			float32LE(this, 'alpha');
			float32BE(this, 'beta');
			float32(this, 'gamma');
		}
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

Deno.test('Float32Ptr', () => {
	for (
		const [Ptr, le] of [
			[Float32Ptr, null],
			[Float32BEPtr, false],
			[Float32LEPtr, true],
		] as [typeof Float32Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 4);

		const fA = round(Math.PI);
		const fB = round(-Math.E);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = fA;
				assertEquals(view.getFloat32(o, le ?? ptr.littleEndian), fA);
				view.setFloat32(o, fB, le ?? ptr.littleEndian);
				assertEquals(ptr[i], fB);
			}
		}
	}
});
