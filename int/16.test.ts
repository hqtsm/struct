import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import {
	getByteLength,
	getByteOffset,
	getLittleEndian,
	getType,
} from '../util.ts';
import { int16, Int16Ptr, uint16, Uint16Ptr } from './16.ts';

Deno.test('int16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int16(this, 'alpha', o);
			o += int16(this, 'beta', o);
			o += int16(this, 'gamma', o, true);
			o += int16(this, 'delta', o, false);
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
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'int16');
	assertEquals(getType(Test, 'beta'), 'int16');
	assertEquals(getType(Test, 'gamma'), 'int16');
	assertEquals(getType(Test, 'delta'), 'int16');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt16(off.alpha, false), 0x7fff);
		assertEquals(view.getInt16(off.beta, false), -2);
		assertEquals(view.getInt16(off.gamma, true), -3);
		assertEquals(view.getInt16(off.delta, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt16(off.alpha, true), 0x7fff);
		assertEquals(view.getInt16(off.beta, true), -2);
		assertEquals(view.getInt16(off.gamma, true), -3);
		assertEquals(view.getInt16(off.delta, false), -4);
	}
});

Deno.test('uint16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint16(this, 'alpha', o);
			o += uint16(this, 'beta', o);
			o += uint16(this, 'gamma', o, true);
			o += uint16(this, 'delta', o, false);
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
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'uint16');
	assertEquals(getType(Test, 'beta'), 'uint16');
	assertEquals(getType(Test, 'gamma'), 'uint16');
	assertEquals(getType(Test, 'delta'), 'uint16');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xfffe);
		assertEquals(test.gamma, 0xfffd);
		assertEquals(test.delta, 0xfffc);
		assertEquals(view.getUint16(off.alpha, false), 0x7fff);
		assertEquals(view.getUint16(off.beta, false), 0xfffe);
		assertEquals(view.getUint16(off.gamma, true), 0xfffd);
		assertEquals(view.getUint16(off.delta, false), 0xfffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xfffe);
		assertEquals(test.gamma, 0xfffd);
		assertEquals(test.delta, 0xfffc);
		assertEquals(view.getUint16(off.alpha, true), 0x7fff);
		assertEquals(view.getUint16(off.beta, true), 0xfffe);
		assertEquals(view.getUint16(off.gamma, true), 0xfffd);
		assertEquals(view.getUint16(off.delta, false), 0xfffc);
	}
});

Deno.test('Int16Ptr', () => {
	const bpe = Int16Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 2);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Int16Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1;
			assertEquals(view.getInt16(o, ptr.littleEndian), -1);
			view.setInt16(o, 1, ptr.littleEndian);
			assertEquals(ptr[i], 1);
		}
	}
});

Deno.test('Uint16Ptr', () => {
	const bpe = Uint16Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 2);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Uint16Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1;
			assertEquals(view.getUint16(o, ptr.littleEndian), 0xffff);
			view.setUint16(o, 1, ptr.littleEndian);
			assertEquals(ptr[i], 1);
		}
	}
});
