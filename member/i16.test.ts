import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI16, memberU16 } from './i16.ts';
import { byteLength, byteOffset, littleEndian } from '../macro.ts';

Deno.test('memberI16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI16(this, 'alpha', o);
			o += memberI16(this, 'beta', o);
			o += memberI16(this, 'gamma', o, true);
			o += memberI16(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 8);
	assertEquals(byteLength(Test, 'alpha'), 2);
	assertEquals(byteLength(Test, 'beta'), 2);
	assertEquals(byteLength(Test, 'gamma'), 2);
	assertEquals(byteLength(Test, 'delta'), 2);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

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

Deno.test('memberU16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU16(this, 'alpha', o);
			o += memberU16(this, 'beta', o);
			o += memberU16(this, 'gamma', o, true);
			o += memberU16(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 8);
	assertEquals(byteLength(Test, 'alpha'), 2);
	assertEquals(byteLength(Test, 'beta'), 2);
	assertEquals(byteLength(Test, 'gamma'), 2);
	assertEquals(byteLength(Test, 'delta'), 2);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

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
