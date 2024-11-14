import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI24, memberU24 } from './i24.ts';
import { getInt24, getUint24 } from '../util.ts';

Deno.test('memberI24', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI24(this, o, 'alpha');
			o += memberI24(this, o, 'beta');
			o += memberI24(this, o, 'gamma', true);
			o += memberI24(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 12);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, -2);
		assertEquals(getInt24(view, 0, false), 0x7fffff);
		assertEquals(getInt24(view, 3, false), -2);
		assertEquals(getInt24(view, 6, true), -3);
		assertEquals(getInt24(view, 9, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, -2);
		assertEquals(getInt24(view, 0, true), 0x7fffff);
		assertEquals(getInt24(view, 3, true), -2);
		assertEquals(getInt24(view, 6, true), -3);
		assertEquals(getInt24(view, 9, false), -4);
	}
});

Deno.test('memberU24', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU24(this, o, 'alpha');
			o += memberU24(this, o, 'beta');
			o += memberI24(this, o, 'gamma', true);
			o += memberI24(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 12);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffff;
		test.beta = 0xfffffe;
		test.gamma = 0xfffffd;
		test.delta = 0xfffffc;

		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, 0xfffffe);
		assertEquals(getUint24(view, 0, false), 0x7fffff);
		assertEquals(getUint24(view, 3, false), 0xfffffe);
		assertEquals(getUint24(view, 6, true), 0xfffffd);
		assertEquals(getUint24(view, 9, false), 0xfffffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffff;
		test.beta = 0xfffffe;
		test.gamma = 0xfffffd;
		test.delta = 0xfffffc;

		assertEquals(test.alpha, 0x7fffff);
		assertEquals(test.beta, 0xfffffe);
		assertEquals(getUint24(view, 0, true), 0x7fffff);
		assertEquals(getUint24(view, 3, true), 0xfffffe);
		assertEquals(getUint24(view, 6, true), 0xfffffd);
		assertEquals(getUint24(view, 9, false), 0xfffffc);
	}
});
