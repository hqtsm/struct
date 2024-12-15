import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import {
	bool16,
	bool16BE,
	Bool16BEPtr,
	bool16LE,
	Bool16LEPtr,
	Bool16Ptr,
} from './16.ts';

Deno.test('bool16', () => {
	class Test extends Struct {
		declare public alpha: boolean;

		declare public beta: boolean;

		declare public gamma: boolean;

		declare public delta: boolean;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = bool16(this, 'alpha', o);
			o = bool16(this, 'beta', o);
			o = bool16LE(this, 'gamma', o);
			o = bool16BE(this, 'delta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 8);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 2);
	assertEquals(getByteLength(Test, 'gamma'), 2);
	assertEquals(getByteLength(Test, 'delta'), 2);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		for (const b of [true, false]) {
			test.alpha = b;
			test.beta = b;
			test.gamma = b;
			test.delta = b;

			assertEquals(test.alpha, b);
			assertEquals(test.beta, b);
			assertEquals(test.gamma, b);
			assertEquals(test.delta, b);
			assertEquals(view.getInt16(off.alpha, false), b ? 1 : 0);
			assertEquals(view.getInt16(off.beta, false), b ? 1 : 0);
			assertEquals(view.getInt16(off.gamma, true), b ? 1 : 0);
			assertEquals(view.getInt16(off.delta, false), b ? 1 : 0);
		}

		for (let o = 2; o--;) {
			test.alpha = false;
			test.beta = false;
			test.gamma = false;
			test.delta = false;
			for (let i = 0xff; i >= 0; i--) {
				data[off.alpha + o] = i;
				data[off.beta + o] = i;
				data[off.gamma + o] = i;
				data[off.delta + o] = i;
				assertEquals(test.alpha, i !== 0);
				assertEquals(test.beta, i !== 0);
				assertEquals(test.gamma, i !== 0);
				assertEquals(test.delta, i !== 0);
			}
		}
	}
	{
		const test = new Test(data.buffer, 0, true);
		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		for (const b of [true, false]) {
			test.alpha = b;
			test.beta = b;
			test.gamma = b;
			test.delta = b;

			assertEquals(test.alpha, b);
			assertEquals(test.beta, b);
			assertEquals(test.gamma, b);
			assertEquals(test.delta, b);
			assertEquals(view.getInt16(off.alpha, true), b ? 1 : 0);
			assertEquals(view.getInt16(off.beta, true), b ? 1 : 0);
			assertEquals(view.getInt16(off.gamma, true), b ? 1 : 0);
			assertEquals(view.getInt16(off.delta, false), b ? 1 : 0);
		}

		for (let o = 2; o--;) {
			test.alpha = false;
			test.beta = false;
			test.gamma = false;
			test.delta = false;
			for (let i = 0xff; i >= 0; i--) {
				data[off.alpha + o] = i;
				data[off.beta + o] = i;
				data[off.gamma + o] = i;
				data[off.delta + o] = i;
				assertEquals(test.alpha, i !== 0);
				assertEquals(test.beta, i !== 0);
				assertEquals(test.gamma, i !== 0);
				assertEquals(test.delta, i !== 0);
			}
		}
	}
});

Deno.test('Bool16Ptr', () => {
	for (
		const [Ptr, le] of [
			[Bool16Ptr, null],
			[Bool16LEPtr, true],
			[Bool16BEPtr, false],
		] as [typeof Bool16Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 2);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = true;
				assertEquals(view.getInt16(o, le ?? ptr.littleEndian), 1);
				ptr[i] = false;
				assertEquals(view.getInt16(o, le ?? ptr.littleEndian), 0);
				view.setInt16(o, -1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], true);
			}
		}
	}
});
