import { assertEquals } from '@std/assert';
import { getInt24, getUint24 } from '@hqtsm/dataview/int/24';

import {
	byteLength,
	byteOffset,
	getKind,
	getSigned,
	getType,
	littleEndian,
} from '../macro.ts';
import { Struct } from '../struct.ts';

import { int24, uint24 } from './24.ts';

Deno.test('int24', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int24(this, 'alpha', o);
			o += int24(this, 'beta', o);
			o += int24(this, 'gamma', o, true);
			o += int24(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 12);
	assertEquals(byteLength(Test, 'alpha'), 3);
	assertEquals(byteLength(Test, 'beta'), 3);
	assertEquals(byteLength(Test, 'gamma'), 3);
	assertEquals(byteLength(Test, 'delta'), 3);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
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
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint24(this, 'alpha', o);
			o += uint24(this, 'beta', o);
			o += uint24(this, 'gamma', o, true);
			o += uint24(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 12);
	assertEquals(byteLength(Test, 'alpha'), 3);
	assertEquals(byteLength(Test, 'beta'), 3);
	assertEquals(byteLength(Test, 'gamma'), 3);
	assertEquals(byteLength(Test, 'delta'), 3);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
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
