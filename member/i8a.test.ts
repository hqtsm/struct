import { assertEquals, assertStrictEquals } from '@std/assert';

import { byteLength, byteOffset, getType, littleEndian } from '../macro.ts';
import { Struct } from '../struct.ts';
import { memberI8A, memberU8A } from './i8a.ts';

Deno.test('memberI8A', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public readonly alpha: Int8Array;

		declare public readonly beta: Int8Array;

		declare public readonly gamma: Int8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI8A(2, this, 'alpha', o);
			o += memberI8A(4, this, 'beta', o);
			o += memberI8A(0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(byteLength(Test, 'alpha'), 2);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 0);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), 'i8a');
	assertEquals(getType(Test, 'beta'), 'i8a');
	assertEquals(getType(Test, 'gamma'), 'i8a');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = -1;
	test.beta[0] = 2;
	test.beta[1] = -2;
	test.beta[2] = 3;
	test.beta[3] = -3;

	assertEquals(test.gamma.length, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);
});

Deno.test('memberU8A', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public readonly alpha: Uint8Array;

		declare public readonly beta: Uint8Array;

		declare public readonly gamma: Uint8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU8A(2, this, 'alpha', o);
			o += memberU8A(4, this, 'beta', o);
			o += memberU8A(0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(byteLength(Test, 'alpha'), 2);
	assertEquals(byteLength(Test, 'beta'), 4);
	assertEquals(byteLength(Test, 'gamma'), 0);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), null);
	assertEquals(getType(Test, 'alpha'), 'u8a');
	assertEquals(getType(Test, 'beta'), 'u8a');
	assertEquals(getType(Test, 'gamma'), 'u8a');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = 0xff;
	test.beta[0] = 2;
	test.beta[1] = 0xfe;
	test.beta[2] = 3;
	test.beta[3] = 0xfd;

	assertEquals(test.gamma.length, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);
});