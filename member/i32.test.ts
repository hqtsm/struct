import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI32, memberU32 } from './i32.ts';

Deno.test('memberI32', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI32(this, 'alpha', o);
			o += memberI32(this, 'beta', o);
			o += memberI32(this, 'gamma', o, true);
			o += memberI32(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 16);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt32(0, false), 0x7fffffff);
		assertEquals(view.getInt32(4, false), -2);
		assertEquals(view.getInt32(8, true), -3);
		assertEquals(view.getInt32(12, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt32(0, true), 0x7fffffff);
		assertEquals(view.getInt32(4, true), -2);
		assertEquals(view.getInt32(8, true), -3);
		assertEquals(view.getInt32(12, false), -4);
	}
});

Deno.test('memberU32', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU32(this, 'alpha', o);
			o += memberU32(this, 'beta', o);
			o += memberU32(this, 'gamma', o, true);
			o += memberU32(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 16);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffff;
		test.beta = 0xfffffffe;
		test.gamma = 0xfffffffd;
		test.delta = 0xfffffffc;

		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, 0xfffffffe);
		assertEquals(test.gamma, 0xfffffffd);
		assertEquals(test.delta, 0xfffffffc);
		assertEquals(view.getUint32(0, false), 0x7fffffff);
		assertEquals(view.getUint32(4, false), 0xfffffffe);
		assertEquals(view.getUint32(8, true), 0xfffffffd);
		assertEquals(view.getUint32(12, false), 0xfffffffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffff;
		test.beta = 0xfffffffe;
		test.gamma = 0xfffffffd;
		test.delta = 0xfffffffc;

		assertEquals(test.alpha, 0x7fffffff);
		assertEquals(test.beta, 0xfffffffe);
		assertEquals(test.gamma, 0xfffffffd);
		assertEquals(test.delta, 0xfffffffc);
		assertEquals(view.getUint32(0, true), 0x7fffffff);
		assertEquals(view.getUint32(4, true), 0xfffffffe);
		assertEquals(view.getUint32(8, true), 0xfffffffd);
		assertEquals(view.getUint32(12, false), 0xfffffffc);
	}
});
