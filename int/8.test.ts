import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import {
	getByteLength,
	getByteOffset,
	getLittleEndian,
	getType,
} from '../util.ts';
import { int8, uint8 } from './8.ts';

Deno.test('int8', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha', o);
			o += int8(this, 'beta', o);
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
	assertEquals(getType(Test, 'alpha'), 'int8');
	assertEquals(getType(Test, 'beta'), 'int8');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = -1;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, -1);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});

Deno.test('uint8', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint8(this, 'alpha', o);
			o += uint8(this, 'beta', o);
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
	assertEquals(getType(Test, 'alpha'), 'uint8');
	assertEquals(getType(Test, 'beta'), 'uint8');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = 0xff;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, 0xff);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});
