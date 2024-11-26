import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import {
	getByteLength,
	getByteOffset,
	getKind,
	getLittleEndian,
	getSigned,
	getType,
} from '../util.ts';
import { int32, uint32 } from './32.ts';

Deno.test('int32', () => {
	class Test extends Struct {
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
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getType(Test, 'gamma'), Number);
	assertEquals(getType(Test, 'delta'), Number);
	assertEquals(getKind(Test, 'alpha'), 'int');
	assertEquals(getKind(Test, 'beta'), 'int');
	assertEquals(getKind(Test, 'gamma'), 'int');
	assertEquals(getKind(Test, 'delta'), 'int');
	assertEquals(getSigned(Test, 'alpha'), true);
	assertEquals(getSigned(Test, 'beta'), true);
	assertEquals(getSigned(Test, 'gamma'), true);
	assertEquals(getSigned(Test, 'delta'), true);

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
			o += uint32(this, 'gamma', o, true);
			o += uint32(this, 'delta', o, false);
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
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getType(Test, 'gamma'), Number);
	assertEquals(getType(Test, 'delta'), Number);
	assertEquals(getKind(Test, 'alpha'), 'int');
	assertEquals(getKind(Test, 'beta'), 'int');
	assertEquals(getKind(Test, 'gamma'), 'int');
	assertEquals(getKind(Test, 'delta'), 'int');
	assertEquals(getSigned(Test, 'alpha'), false);
	assertEquals(getSigned(Test, 'beta'), false);
	assertEquals(getSigned(Test, 'gamma'), false);
	assertEquals(getSigned(Test, 'delta'), false);

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
