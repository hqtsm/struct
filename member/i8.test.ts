import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI8, memberI8A, memberU8, memberU8A } from './i8.ts';
import { byteLength, byteOffset, littleEndian } from '../macro.ts';

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

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = 0xff;

	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, 0xff);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});

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
});
