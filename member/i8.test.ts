import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI8, memberI8A, memberU8, memberU8A } from './i8.ts';

Deno.test('memberI8', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI8(this, o, 'alpha');
			o += memberI8(this, o, 'beta');
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 2);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 1;
	test.beta = -1;

	assertEquals(test.alpha, 1);
	assertEquals(test.beta, -1);
	assertEquals(data, new Uint8Array([1, 0xff]));
});

Deno.test('memberU8', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU8(this, o, 'alpha');
			o += memberU8(this, o, 'beta');
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 2);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 1;
	test.beta = 0xff;

	assertEquals(test.alpha, 1);
	assertEquals(test.beta, 0xff);
	assertEquals(data, new Uint8Array([1, 0xff]));
});

Deno.test('memberI8A', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public readonly alpha: Int8Array;

		declare public readonly beta: Int8Array;

		declare public readonly gamma: Int8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI8A(this, o, 'alpha', 2);
			o += memberI8A(this, o, 'beta', 4);
			o += memberI8A(this, o, 'gamma', 0);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 6);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = -1;
	test.beta[0] = 2;
	test.beta[1] = -2;
	test.beta[2] = 3;
	test.beta[3] = -3;

	assertEquals(test.gamma.length, 0);
	assertEquals(data, new Uint8Array([1, 0xff, 2, 0xfe, 3, 0xfd]));
});

Deno.test('memberU8A', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public readonly alpha: Uint8Array;

		declare public readonly beta: Uint8Array;

		declare public readonly gamma: Uint8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU8A(this, o, 'alpha', 2);
			o += memberU8A(this, o, 'beta', 4);
			o += memberU8A(this, o, 'gamma', 0);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 6);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = 0xff;
	test.beta[0] = 2;
	test.beta[1] = 0xfe;
	test.beta[2] = 3;
	test.beta[3] = 0xfd;

	assertEquals(test.gamma.length, 0);
	assertEquals(data, new Uint8Array([1, 0xff, 2, 0xfe, 3, 0xfd]));
});
