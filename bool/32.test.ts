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

import { bool32 } from './32.ts';

Deno.test('bool32', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: boolean;

		declare public beta: boolean;

		declare public gamma: boolean;

		declare public delta: boolean;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += bool32(this, 'alpha', o);
			o += bool32(this, 'beta', o);
			o += bool32(this, 'gamma', o, true);
			o += bool32(this, 'delta', o, false);
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
	assertEquals(getType(Test, 'alpha'), Boolean);
	assertEquals(getType(Test, 'beta'), Boolean);
	assertEquals(getType(Test, 'gamma'), Boolean);
	assertEquals(getType(Test, 'delta'), Boolean);
	assertEquals(getKind(Test, 'alpha'), 'bool');
	assertEquals(getKind(Test, 'beta'), 'bool');
	assertEquals(getKind(Test, 'gamma'), 'bool');
	assertEquals(getKind(Test, 'delta'), 'bool');
	assertEquals(getSigned(Test, 'alpha'), null);
	assertEquals(getSigned(Test, 'beta'), null);
	assertEquals(getSigned(Test, 'gamma'), null);
	assertEquals(getSigned(Test, 'delta'), null);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		for (const b of [true, false]) {
			test.alpha = b;
			test.beta = b;
			test.gamma = b;
			test.delta = b;

			assertEquals(test.alpha, b);
			assertEquals(test.beta, b);
			assertEquals(test.gamma, b);
			assertEquals(test.delta, b);
			assertEquals(view.getInt32(off.alpha, false), b ? 1 : 0);
			assertEquals(view.getInt32(off.beta, false), b ? 1 : 0);
			assertEquals(view.getInt32(off.gamma, true), b ? 1 : 0);
			assertEquals(view.getInt32(off.delta, false), b ? 1 : 0);
		}
	}
	{
		const test = new Test(data.buffer, 0, true);
		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		for (const b of [true, false]) {
			test.alpha = b;
			test.beta = b;
			test.gamma = b;
			test.delta = b;

			assertEquals(test.alpha, b);
			assertEquals(test.beta, b);
			assertEquals(test.gamma, b);
			assertEquals(test.delta, b);
			assertEquals(view.getInt32(off.alpha, true), b ? 1 : 0);
			assertEquals(view.getInt32(off.beta, true), b ? 1 : 0);
			assertEquals(view.getInt32(off.gamma, true), b ? 1 : 0);
			assertEquals(view.getInt32(off.delta, false), b ? 1 : 0);
		}
	}
});
