import { assertEquals } from '@std/assert';

import {
	byteLength,
	byteOffset,
	getKind,
	getSigned,
	getType,
	littleEndian,
} from '../macro.ts';
import { Struct } from '../struct.ts';

import { int16, uint16 } from './16.ts';

Deno.test('int16', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

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
		declare public readonly ['constructor']: typeof Test;

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
