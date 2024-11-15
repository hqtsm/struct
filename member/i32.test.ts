import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI32, memberU32 } from './i32.ts';
import { byteLength, byteOffset, littleEndian } from '../macro.ts';

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

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(byteLength(Test), 16);
	assertEquals(byteLength(Test, 'alpha'), 4);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 4);
	assertEquals(byteLength(Test, 'delta'), 4);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);

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

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(byteLength(Test), 16);
	assertEquals(byteLength(Test, 'alpha'), 4);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 4);
	assertEquals(byteLength(Test, 'delta'), 4);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);

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
