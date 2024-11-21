import { assertEquals } from '@std/assert';

import { byteLength, byteOffset, getType, littleEndian } from '../../macro.ts';
import { Struct } from '../../struct.ts';

import { int32, uint32 } from './32.ts';

Deno.test('int32', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int32(this, 'alpha', o);
			o += int32(this, 'beta', o);
			o += int32(this, 'gamma', o, true);
			o += int32(this, 'delta', o, false);
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
	assertEquals(byteLength(Test, 'alpha'), 4);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 4);
	assertEquals(byteLength(Test, 'delta'), 4);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'i32');
	assertEquals(getType(Test, 'beta'), 'i32');
	assertEquals(getType(Test, 'gamma'), 'i32');
	assertEquals(getType(Test, 'delta'), 'i32');

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
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint32(this, 'alpha', o);
			o += uint32(this, 'beta', o);
			o += uint32(this, 'gamma', o, true);
			o += uint32(this, 'delta', o, false);
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
	assertEquals(byteLength(Test, 'alpha'), 4);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 4);
	assertEquals(byteLength(Test, 'delta'), 4);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'u32');
	assertEquals(getType(Test, 'beta'), 'u32');
	assertEquals(getType(Test, 'gamma'), 'u32');
	assertEquals(getType(Test, 'delta'), 'u32');

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
