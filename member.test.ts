import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';
import { uint8 } from './int/8.ts';
import { uint32 } from './int/32.ts';
import { member, memberBE, memberLE, pad } from './member.ts';
import { Struct } from './struct.ts';
import { getByteLength, getByteOffset } from './util.ts';

Deno.test('member', () => {
	class TestChild extends Struct {
		declare public one: number;

		declare public two: number;

		static {
			uint32(this, 'one');
			uint32(this, 'two');
		}
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

		static {
			memberLE(TestChild, this, 'alpha');
			memberBE(TestChild, this, 'beta');
			member(TestChild, this, 'gamma');
		}
	}

	class TestParentExtended extends TestParent {
		static {
			// Extending overrides are possible.
			member(
				TestChildExtended,
				this,
				'gamma',
				getByteOffset(this, 'gamma'),
			);
		}
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

Deno.test('pad', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public pad: never;

		declare public beta: number;

		static {
			uint32(this, 'alpha');

			// Padding can be a never member.
			pad(8, this, 'pad');

			uint8(this, 'beta');

			// Or anonymous.
			pad(3, this);
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		pad: getByteOffset(Test, 'pad'),
		beta: getByteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 16);
	assertEquals(getByteLength(Test, 'alpha'), 4);
	assertEquals(getByteLength(Test, 'pad'), 8);
	assertEquals(getByteLength(Test, 'beta'), 1);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	const test = new Test(data.buffer);
	view.setUint32(off.alpha, 0x12345678, test.littleEndian);
	view.setUint8(off.beta, 0xab);

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x12345678);
	assertEquals(test.beta, 0xab);
	assertThrows(() => {
		void test.pad;
	});
	assertThrows(() => {
		(test as { pad: unknown }).pad = null;
	});
});
