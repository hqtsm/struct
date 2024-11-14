import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI16, memberU16 } from './i16.ts';

Deno.test('memberI16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI16(this, o, 'alpha');
			o += memberI16(this, o, 'beta');
			o += memberI16(this, o, 'gamma', true);
			o += memberI16(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 8);

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
		assertEquals(view.getInt16(0, false), 0x7fff);
		assertEquals(view.getInt16(2, false), -2);
		assertEquals(view.getInt16(4, true), -3);
		assertEquals(view.getInt16(6, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -2);
		assertEquals(view.getInt16(0, true), 0x7fff);
		assertEquals(view.getInt16(2, true), -2);
		assertEquals(view.getInt16(4, true), -3);
		assertEquals(view.getInt16(6, false), -4);
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
			o += memberU16(this, o, 'alpha');
			o += memberU16(this, o, 'beta');
			o += memberI16(this, o, 'gamma', true);
			o += memberI16(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 8);

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
		assertEquals(view.getUint16(0, false), 0x7fff);
		assertEquals(view.getUint16(2, false), 0xfffe);
		assertEquals(view.getUint16(4, true), 0xfffd);
		assertEquals(view.getUint16(6, false), 0xfffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xfffe);
		assertEquals(view.getUint16(0, true), 0x7fff);
		assertEquals(view.getUint16(2, true), 0xfffe);
		assertEquals(view.getUint16(4, true), 0xfffd);
		assertEquals(view.getUint16(6, false), 0xfffc);
	}
});
