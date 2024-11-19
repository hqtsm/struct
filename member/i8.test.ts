import { assertEquals } from '@std/assert';

import { byteLength, byteOffset, getType, littleEndian } from '../macro.ts';
import { Struct } from '../struct.ts';
import { memberI8, memberU8 } from './i8.ts';

Deno.test('memberI8', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI8(this, 'alpha', o);
			o += memberI8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 2);
	assertEquals(byteLength(Test, 'alpha'), 1);
	assertEquals(byteLength(Test, 'beta'), 1);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(getType(Test, 'alpha'), 'i8');
	assertEquals(getType(Test, 'beta'), 'i8');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = -1;

	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, -1);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});

Deno.test('memberU8', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU8(this, 'alpha', o);
			o += memberU8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 2);
	assertEquals(byteLength(Test, 'alpha'), 1);
	assertEquals(byteLength(Test, 'beta'), 1);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(getType(Test, 'alpha'), 'u8');
	assertEquals(getType(Test, 'beta'), 'u8');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = 0xff;

	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, 0xff);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});
