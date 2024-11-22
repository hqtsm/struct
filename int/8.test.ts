import { assertEquals } from '@std/assert';

import {
	getByteLength,
	getByteOffset,
	getKind,
	getLittleEndian,
	getSigned,
	getType,
} from '../macro.ts';
import { Struct } from '../struct.ts';

import { int8, uint8 } from './8.ts';

Deno.test('int8', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

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
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getKind(Test, 'alpha'), 'int');
	assertEquals(getKind(Test, 'beta'), 'int');
	assertEquals(getSigned(Test, 'alpha'), true);
	assertEquals(getSigned(Test, 'beta'), true);

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
		declare public readonly ['constructor']: typeof Test;

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
	assertEquals(getType(Test, 'alpha'), Number);
	assertEquals(getType(Test, 'beta'), Number);
	assertEquals(getKind(Test, 'alpha'), 'int');
	assertEquals(getKind(Test, 'beta'), 'int');
	assertEquals(getSigned(Test, 'alpha'), false);
	assertEquals(getSigned(Test, 'beta'), false);

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
