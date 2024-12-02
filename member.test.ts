import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';

import { uint32 } from './int/32.ts';
import { member, pad, view } from './member.ts';
import { Struct } from './struct.ts';
import { getByteLength, getByteOffset } from './util.ts';

Deno.test('member', () => {
	class TestChild extends Struct {
		declare public one: number;

		declare public two: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint32(this, 'one', o);
			o += uint32(this, 'two', o);
			// Expected type checking error:
			// o += uint32(this, 'byteLength', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestChildExtended extends TestChild {
		public extraProperty = 123;

		public extraMethod(): number {
			return this.extraProperty;
		}
	}

	class TestParent extends Struct {
		declare public alpha: TestChild;

		declare public beta: TestChild;

		declare public gamma: TestChild;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += member(TestChild, this, 'alpha', o, true);
			o += member(TestChild, this, 'beta', o, false);
			o += member(TestChild, this, 'gamma', o);
			// Expected type checking error:
			// o += member(Struct, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestParentExtended extends TestParent {
		public static override readonly BYTE_LENGTH: number = ((o) => {
			// Extending overrides are possible.
			member(
				TestChildExtended,
				this,
				'gamma',
				getByteOffset(this, 'gamma'),
			);
			return o;
		})(super.BYTE_LENGTH);
	}

	const cOff = {
		one: getByteOffset(TestChild, 'one'),
		two: getByteOffset(TestChild, 'two'),
	};
	const pOff = {
		alpha: getByteOffset(TestParent, 'alpha'),
		beta: getByteOffset(TestParent, 'beta'),
		gamma: getByteOffset(TestParent, 'gamma'),
	};

	assertEquals(TestParent.BYTE_LENGTH, 24);
	assertEquals(getByteLength(TestParent, 'alpha'), 8);
	assertEquals(getByteLength(TestParent, 'beta'), 8);
	assertEquals(getByteLength(TestParent, 'gamma'), 8);

	const data = new Uint8Array(TestParent.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new TestParentExtended(data.buffer, 0, true);
		test.alpha.two = 0x12345678;
		test.beta.two = 0x23456789;
		test.gamma.two = 0x34567890;

		assertEquals(test.byteLength, TestParent.BYTE_LENGTH);
		assertEquals(test.alpha.littleEndian, true);
		assertEquals(test.beta.littleEndian, false);
		assertEquals(test.gamma.littleEndian, true);
		assertEquals(test.alpha.two, 0x12345678);
		assertEquals(test.beta.two, 0x23456789);
		assertEquals(test.gamma.two, 0x34567890);
		assertEquals(view.getUint32(pOff.alpha + cOff.two, true), 0x12345678);
		assertEquals(view.getUint32(pOff.beta + cOff.two, false), 0x23456789);
		assertEquals(view.getUint32(pOff.gamma + cOff.two, true), 0x34567890);

		assertStrictEquals(test.alpha, test.alpha);
		data.fill(0);
	}
	{
		const test = new TestParentExtended(data.buffer, 0, false);
		test.alpha.two = 0x12345678;
		test.beta.two = 0x23456789;
		test.gamma.two = 0x34567890;

		assertEquals(test.byteLength, TestParent.BYTE_LENGTH);
		assertEquals(test.alpha.littleEndian, true);
		assertEquals(test.beta.littleEndian, false);
		assertEquals(test.gamma.littleEndian, false);
		assertEquals(test.alpha.two, 0x12345678);
		assertEquals(test.beta.two, 0x23456789);
		assertEquals(test.gamma.two, 0x34567890);
		assertEquals(view.getUint32(pOff.alpha + cOff.two, true), 0x12345678);
		assertEquals(view.getUint32(pOff.beta + cOff.two, false), 0x23456789);
		assertEquals(view.getUint32(pOff.gamma + cOff.two, false), 0x34567890);

		assertStrictEquals(test.alpha, test.alpha);
		data.fill(0);
	}

	{
		const test = new TestParentExtended(data.buffer, 0, true);
		test.alpha.one = 0xa1a2a3a4;
		test.alpha.two = 0xb1b2b3b4;
		test.gamma = test.alpha;

		assertEquals(test.alpha.one, 0xa1a2a3a4);
		assertEquals(test.alpha.two, 0xb1b2b3b4);
		assertEquals(test.gamma.one, 0xa1a2a3a4);
		assertEquals(test.gamma.two, 0xb1b2b3b4);

		assertNotStrictEquals(test.alpha, test.beta);
		assertNotStrictEquals(test.alpha, test.gamma);
		data.fill(0);
	}
});

Deno.test('array: Int8Array', () => {
	class Test extends Struct {
		declare public alpha: Int8Array;

		declare public beta: Int8Array;

		declare public gamma: Int8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += view(Int8Array, 2, this, 'alpha', o);
			o += view(Int8Array, 4, this, 'beta', o);
			o += view(Int8Array, 0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 0);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = -1;
	test.beta[0] = 2;
	test.beta[1] = -2;
	test.beta[2] = 3;
	test.beta[3] = -3;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.gamma.length, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);

	const source = new Int8Array([4, -4]);
	test.alpha = source;
	assertEquals(test.alpha, source);
	assertNotStrictEquals(test.alpha, source);
});

Deno.test('array: Uint8Array', () => {
	class Test extends Struct {
		declare public alpha: Uint8Array;

		declare public beta: Uint8Array;

		declare public gamma: Uint8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += view(Uint8Array, 2, this, 'alpha', o);
			o += view(Uint8Array, 4, this, 'beta', o);
			o += view(Uint8Array, 0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 0);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = 0xff;
	test.beta[0] = 2;
	test.beta[1] = 0xfe;
	test.beta[2] = 3;
	test.beta[3] = 0xfd;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.gamma.length, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);

	const source = new Uint8Array([4, 252]);
	test.alpha = source;
	assertEquals(test.alpha, source);
	assertNotStrictEquals(test.alpha, source);
});

Deno.test('array: Uint8ClampedArray', () => {
	class Test extends Struct {
		declare public alpha: Uint8ClampedArray;

		declare public beta: Uint8ClampedArray;

		declare public gamma: Uint8ClampedArray;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += view(Uint8ClampedArray, 2, this, 'alpha', o);
			o += view(Uint8ClampedArray, 4, this, 'beta', o);
			o += view(Uint8ClampedArray, 0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 0);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha[0] = 1;
	test.alpha[1] = 0xff + 1;
	test.beta[0] = 2;
	test.beta[1] = 0xfe;
	test.beta[2] = 3;
	test.beta[3] = 0xfd;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.gamma.length, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);

	const source = new Uint8ClampedArray([4, 252]);
	test.alpha = source;
	assertEquals(test.alpha, source);
	assertNotStrictEquals(test.alpha, source);
});

Deno.test('view: DataView', () => {
	class Test extends Struct {
		declare public alpha: DataView;

		declare public beta: DataView;

		declare public gamma: DataView;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += view(DataView, 2, this, 'alpha', o);
			o += view(DataView, 4, this, 'beta', o);
			o += view(DataView, 0, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 4);
	assertEquals(getByteLength(Test, 'gamma'), 0);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha.setUint8(0, 1);
	test.alpha.setUint8(1, -1);
	test.beta.setUint8(0, 2);
	test.beta.setUint8(1, -2);
	test.beta.setUint8(2, 3);
	test.beta.setUint8(3, -3);

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.gamma.byteLength, 0);
	assertEquals(data[off.alpha], 1);
	assertEquals(data[off.alpha + 1], 0xff);
	assertEquals(data[off.beta], 2);
	assertEquals(data[off.beta + 1], 0xfe);
	assertEquals(data[off.beta + 2], 3);
	assertEquals(data[off.beta + 3], 0xfd);

	assertStrictEquals(test.alpha, test.alpha);

	const source = new DataView(new Uint8Array([4, 252]).buffer);
	test.alpha = source;
	assertEquals(
		new Uint8Array(
			test.alpha.buffer,
			test.alpha.byteOffset,
			test.alpha.byteLength,
		),
		new Uint8Array(source.buffer, source.byteOffset, source.byteLength),
	);
	assertNotStrictEquals(test.alpha, source);
});

Deno.test('pad', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public mystery: unknown;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint32(this, 'alpha', o);
			o += pad(8, this, 'mystery', o);
			o += uint32(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		mystery: getByteOffset(Test, 'mystery'),
		beta: getByteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(getByteLength(Test, 'alpha'), 4);
	assertEquals(getByteLength(Test, 'mystery'), 8);
	assertEquals(getByteLength(Test, 'beta'), 4);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	const test = new Test(data.buffer);
	view.setUint32(off.alpha, 0x12345678, test.littleEndian);
	view.setUint32(off.beta, 0x23456789, test.littleEndian);

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x12345678);
	assertEquals(test.beta, 0x23456789);

	assertThrows(() => {
		void test.mystery;
	});
	assertThrows(() => {
		test.mystery = null;
	});
});
