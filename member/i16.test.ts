import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI16, memberU16 } from './i16.ts';

Deno.test('memberI16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI16(this, o, 'alpha');
			o += memberI16(this, o, 'beta');
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 4);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = -1;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -1);
		assertEquals(view.getInt16(0, false), 0x7fff);
		assertEquals(view.getInt16(2, false), -1);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = -1;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -1);
		assertEquals(view.getInt16(0, true), 0x7fff);
		assertEquals(view.getInt16(2, true), -1);
	}
});

Deno.test('memberU16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU16(this, o, 'alpha');
			o += memberU16(this, o, 'beta');
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 4);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = 0xFFFF;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xFFFF);
		assertEquals(view.getUint16(0, false), 0x7fff);
		assertEquals(view.getUint16(2, false), 0xFFFF);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = 0xFFFF;

		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xFFFF);
		assertEquals(view.getUint16(0, true), 0x7fff);
		assertEquals(view.getUint16(2, true), 0xFFFF);
	}
});
