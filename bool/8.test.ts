import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import {
	getByteLength,
	getByteOffset,
	getLittleEndian,
	getType,
} from '../util.ts';
import { bool8 } from './8.ts';

Deno.test('bool8', () => {
	class Test extends Struct {
		declare public alpha: boolean;

		declare public beta: boolean;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += bool8(this, 'alpha', o);
			o += bool8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 2);
	assertEquals(getByteLength(Test, 'alpha'), 1);
	assertEquals(getByteLength(Test, 'beta'), 1);
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getType(Test, 'alpha'), 'bool8');
	assertEquals(getType(Test, 'beta'), 'bool8');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	for (const b of [true, false]) {
		test.alpha = b;
		test.beta = b;
		assertEquals(test.alpha, b);
		assertEquals(test.beta, b);
		assertEquals(data[off.alpha], b ? 1 : 0);
		assertEquals(data[off.beta], b ? 1 : 0);
	}

	for (let i = 0xff; i >= 0; i--) {
		data[off.alpha] = i;
		data[off.beta] = i;
		assertEquals(test.alpha, i !== 0);
		assertEquals(test.beta, i !== 0);
	}
});
