import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import {
	int32,
	int32BE,
	Int32BEPtr,
	int32LE,
	Int32LEPtr,
	Int32Ptr,
	uint32,
	uint32BE,
	Uint32BEPtr,
	uint32LE,
	Uint32LEPtr,
	Uint32Ptr,
} from './32.ts';

Deno.test('int32', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int32(this, 'alpha', o);
			o += int32(this, 'beta', o);
			o += int32LE(this, 'gamma', o);
			o += int32BE(this, 'delta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(getByteLength(Test, 'alpha'), 4);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 4);
	assertEquals(getByteLength(Test, 'delta'), 4);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt32(off.alpha, false), 0x7fffffff);
		assertEquals(view.getInt32(off.beta, false), -2);
		assertEquals(view.getInt32(off.gamma, true), -3);
		assertEquals(view.getInt32(off.delta, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt32(off.alpha, true), 0x7fffffff);
		assertEquals(view.getInt32(off.beta, true), -2);
		assertEquals(view.getInt32(off.gamma, true), -3);
		assertEquals(view.getInt32(off.delta, false), -4);
	}
});

Deno.test('uint32', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint32(this, 'alpha', o);
			o += uint32(this, 'beta', o);
			o += uint32LE(this, 'gamma', o);
			o += uint32BE(this, 'delta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(getByteLength(Test, 'alpha'), 4);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 4);
	assertEquals(getByteLength(Test, 'delta'), 4);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffff;
		test.beta = 0xfffffffe;
		test.gamma = 0xfffffffd;
		test.delta = 0xfffffffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, 0xfffffffe);
		assertEquals(test.gamma, 0xfffffffd);
		assertEquals(test.delta, 0xfffffffc);
		assertEquals(view.getUint32(off.alpha, false), 0x7fffffff);
		assertEquals(view.getUint32(off.beta, false), 0xfffffffe);
		assertEquals(view.getUint32(off.gamma, true), 0xfffffffd);
		assertEquals(view.getUint32(off.delta, false), 0xfffffffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffff;
		test.beta = 0xfffffffe;
		test.gamma = 0xfffffffd;
		test.delta = 0xfffffffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, 0xfffffffe);
		assertEquals(test.gamma, 0xfffffffd);
		assertEquals(test.delta, 0xfffffffc);
		assertEquals(view.getUint32(off.alpha, true), 0x7fffffff);
		assertEquals(view.getUint32(off.beta, true), 0xfffffffe);
		assertEquals(view.getUint32(off.gamma, true), 0xfffffffd);
		assertEquals(view.getUint32(off.delta, false), 0xfffffffc);
	}
});

Deno.test('Int32Ptr', () => {
	for (
		const [Ptr, le] of [
			[Int32Ptr, null],
			[Int32BEPtr, false],
			[Int32LEPtr, true],
		] as [typeof Int32Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 4);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(view.getInt32(o, le ?? ptr.littleEndian), -1);
				view.setInt32(o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}
	}
});

Deno.test('Uint32Ptr', () => {
	for (
		const [Ptr, le] of [
			[Uint32Ptr, null],
			[Uint32BEPtr, false],
			[Uint32LEPtr, true],
		] as [typeof Uint32Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 4);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(
					view.getUint32(o, le ?? ptr.littleEndian),
					0xffffffff,
				);
				view.setUint32(o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}
	}
});
