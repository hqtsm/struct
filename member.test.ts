import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
} from '@std/assert';

import {
	byteLength,
	byteOffset,
	getKind,
	getSigned,
	getType,
	littleEndian,
} from './macro.ts';
import { Struct } from './struct.ts';
import { uint32 } from './int/32.ts';
import { array, member, view } from './member.ts';

Deno.test('member', () => {
	class TestChild extends Struct {
		declare public readonly ['constructor']: typeof TestChild;

		declare public one: number;

		declare public two: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint32(this, 'one', o);
			o += uint32(this, 'two', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestChildExtended extends TestChild {
		declare public readonly ['constructor']: typeof TestChildExtended;

		public extraProperty = 123;

		public extraMethod(): number {
			return this.extraProperty;
		}
	}

	class TestParent extends Struct {
		declare public readonly ['constructor']: typeof TestParent;

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
		declare public readonly ['constructor']: typeof TestParentExtended;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			// Extending overrides are possible.
			member(
				TestChildExtended,
				this,
				'gamma',
				byteOffset(this, 'gamma'),
			);
			return o;
		})(super.BYTE_LENGTH);
	}

	const cOff = {
		one: byteOffset(TestChild, 'one'),
		two: byteOffset(TestChild, 'two'),
	};
	const pOff = {
		alpha: byteOffset(TestParent, 'alpha'),
		beta: byteOffset(TestParent, 'beta'),
		gamma: byteOffset(TestParent, 'gamma'),
	};

	assertEquals(TestParent.BYTE_LENGTH, 24);
	assertEquals(byteLength(TestParent, 'alpha'), 8);
	assertEquals(byteLength(TestParent, 'beta'), 8);
	assertEquals(byteLength(TestParent, 'gamma'), 8);
	assertEquals(littleEndian(TestParent, 'alpha'), true);
	assertEquals(littleEndian(TestParent, 'beta'), false);
	assertEquals(littleEndian(TestParent, 'gamma'), null);
	assertEquals(getType(TestParent, 'alpha'), TestChild);
	assertEquals(getType(TestParent, 'beta'), TestChild);
	assertEquals(getType(TestParent, 'gamma'), TestChild);
	assertEquals(getKind(TestParent, 'alpha'), 'member');
	assertEquals(getKind(TestParent, 'beta'), 'member');
	assertEquals(getKind(TestParent, 'gamma'), 'member');
	assertEquals(getSigned(TestParent, 'alpha'), null);
	assertEquals(getSigned(TestParent, 'beta'), null);
	assertEquals(getSigned(TestParent, 'gamma'), null);

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
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: Int8Array;

		declare public beta: Int8Array;

		declare public gamma: Int8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += array(Int8Array, 2, this, 'alpha', o);
			o += array(Int8Array, 4, this, 'beta', o);
			o += array(Int8Array, 0, this, 'gamma', o);
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
	assertEquals(getType(Test, 'alpha'), Int8Array);
	assertEquals(getType(Test, 'beta'), Int8Array);
	assertEquals(getType(Test, 'gamma'), Int8Array);
	assertEquals(getKind(Test, 'alpha'), 'array');
	assertEquals(getKind(Test, 'beta'), 'array');
	assertEquals(getKind(Test, 'gamma'), 'array');
	assertEquals(getSigned(Test, 'alpha'), null);
	assertEquals(getSigned(Test, 'beta'), null);
	assertEquals(getSigned(Test, 'gamma'), null);

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
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: Uint8Array;

		declare public beta: Uint8Array;

		declare public gamma: Uint8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += array(Uint8Array, 2, this, 'alpha', o);
			o += array(Uint8Array, 4, this, 'beta', o);
			o += array(Uint8Array, 0, this, 'gamma', o);
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
	assertEquals(getType(Test, 'alpha'), Uint8Array);
	assertEquals(getType(Test, 'beta'), Uint8Array);
	assertEquals(getType(Test, 'gamma'), Uint8Array);
	assertEquals(getKind(Test, 'alpha'), 'array');
	assertEquals(getKind(Test, 'beta'), 'array');
	assertEquals(getKind(Test, 'gamma'), 'array');
	assertEquals(getSigned(Test, 'alpha'), null);
	assertEquals(getSigned(Test, 'beta'), null);
	assertEquals(getSigned(Test, 'gamma'), null);

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
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: Uint8ClampedArray;

		declare public beta: Uint8ClampedArray;

		declare public gamma: Uint8ClampedArray;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += array(Uint8ClampedArray, 2, this, 'alpha', o);
			o += array(Uint8ClampedArray, 4, this, 'beta', o);
			o += array(Uint8ClampedArray, 0, this, 'gamma', o);
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
	assertEquals(getType(Test, 'alpha'), Uint8ClampedArray);
	assertEquals(getType(Test, 'beta'), Uint8ClampedArray);
	assertEquals(getType(Test, 'gamma'), Uint8ClampedArray);
	assertEquals(getKind(Test, 'alpha'), 'array');
	assertEquals(getKind(Test, 'beta'), 'array');
	assertEquals(getKind(Test, 'gamma'), 'array');
	assertEquals(getSigned(Test, 'alpha'), null);
	assertEquals(getSigned(Test, 'beta'), null);
	assertEquals(getSigned(Test, 'gamma'), null);

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
		declare public readonly ['constructor']: typeof Test;

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
	assertEquals(getType(Test, 'alpha'), DataView);
	assertEquals(getType(Test, 'beta'), DataView);
	assertEquals(getType(Test, 'gamma'), DataView);
	assertEquals(getKind(Test, 'alpha'), 'view');
	assertEquals(getKind(Test, 'beta'), 'view');
	assertEquals(getKind(Test, 'gamma'), 'view');
	assertEquals(getSigned(Test, 'alpha'), null);
	assertEquals(getSigned(Test, 'beta'), null);
	assertEquals(getSigned(Test, 'gamma'), null);

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
