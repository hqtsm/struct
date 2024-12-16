import {
	getInt24,
	getUint24,
	setInt24,
	setUint24,
} from '@hqtsm/dataview/int/24';
import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import {
	int24,
	int24BE,
	Int24BEPtr,
	int24LE,
	Int24LEPtr,
	Int24Ptr,
	uint24,
	uint24BE,
	Uint24BEPtr,
	uint24LE,
	Uint24LEPtr,
	Uint24Ptr,
} from './24.ts';

Deno.test('int24', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		static {
			int24(this, 'alpha');
			int24(this, 'beta');
			int24LE(this, 'gamma');
			int24BE(this, 'delta');
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 12);
	assertEquals(getByteLength(Test, 'alpha'), 3);
	assertEquals(getByteLength(Test, 'beta'), 3);
	assertEquals(getByteLength(Test, 'gamma'), 3);
	assertEquals(getByteLength(Test, 'delta'), 3);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(getInt24(view, off.alpha, false), 0x7fffff);
		assertEquals(getInt24(view, off.beta, false), -2);
		assertEquals(getInt24(view, off.gamma, true), -3);
		assertEquals(getInt24(view, off.delta, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(getInt24(view, off.alpha, true), 0x7fffff);
		assertEquals(getInt24(view, off.beta, true), -2);
		assertEquals(getInt24(view, off.gamma, true), -3);
		assertEquals(getInt24(view, off.delta, false), -4);
	}
});

Deno.test('uint24', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		static {
			uint24(this, 'alpha');
			uint24(this, 'beta');
			uint24LE(this, 'gamma');
			uint24BE(this, 'delta');
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 12);
	assertEquals(getByteLength(Test, 'alpha'), 3);
	assertEquals(getByteLength(Test, 'beta'), 3);
	assertEquals(getByteLength(Test, 'gamma'), 3);
	assertEquals(getByteLength(Test, 'delta'), 3);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffff;
		test.beta = 0xfffffe;
		test.gamma = 0xfffffd;
		test.delta = 0xfffffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, 0xfffffe);
		assertEquals(test.gamma, 0xfffffd);
		assertEquals(test.delta, 0xfffffc);
		assertEquals(getUint24(view, off.alpha, false), 0x7fffff);
		assertEquals(getUint24(view, off.beta, false), 0xfffffe);
		assertEquals(getUint24(view, off.gamma, true), 0xfffffd);
		assertEquals(getUint24(view, off.delta, false), 0xfffffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffff;
		test.beta = 0xfffffe;
		test.gamma = 0xfffffd;
		test.delta = 0xfffffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, 0xfffffe);
		assertEquals(test.gamma, 0xfffffd);
		assertEquals(test.delta, 0xfffffc);
		assertEquals(getUint24(view, off.alpha, true), 0x7fffff);
		assertEquals(getUint24(view, off.beta, true), 0xfffffe);
		assertEquals(getUint24(view, off.gamma, true), 0xfffffd);
		assertEquals(getUint24(view, off.delta, false), 0xfffffc);
	}
});

Deno.test('Int24Ptr', () => {
	for (
		const [Ptr, le] of [
			[Int24Ptr, null],
			[Int24BEPtr, false],
			[Int24LEPtr, true],
		] as [typeof Int24Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 3);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(getInt24(view, o, le ?? ptr.littleEndian), -1);
				setInt24(view, o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}
	}
});

Deno.test('Uint24Ptr', () => {
	for (
		const [Ptr, le] of [
			[Uint24Ptr, null],
			[Uint24BEPtr, false],
			[Uint24LEPtr, true],
		] as [typeof Uint24Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 3);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(
					getUint24(view, o, le ?? ptr.littleEndian),
					0xffffff,
				);
				setUint24(view, o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}
	}
});
