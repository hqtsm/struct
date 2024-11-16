import { assertEquals, assertStrictEquals } from '@std/assert';

import { byteLength, byteOffset, getType, littleEndian } from '../macro.ts';
import { Struct } from '../struct.ts';
import { memberU32 } from './i32.ts';
import { memberStruct } from './struct.ts';

Deno.test('memberStruct', () => {
	class TestChild extends Struct {
		declare public readonly ['constructor']: typeof TestChild;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU32(this, 'alpha', o);
			o += memberU32(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestParent extends Struct {
		declare public readonly ['constructor']: typeof TestParent;

		declare public readonly alpha: TestChild;

		declare public readonly beta: TestChild;

		declare public readonly gamma: TestChild;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberStruct(TestChild, this, 'alpha', o, true);
			o += memberStruct(TestChild, this, 'beta', o, false);
			o += memberStruct(TestChild, this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const offBeta = byteOffset(TestChild, 'beta');
	const off = {
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

	const data = new Uint8Array(TestParent.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new TestParent(data.buffer, 0, true);
		test.alpha.beta = 0x12345678;
		test.beta.beta = 0x23456789;
		test.gamma.beta = 0x34567890;

		assertEquals(test.alpha.littleEndian, true);
		assertEquals(test.beta.littleEndian, false);
		assertEquals(test.gamma.littleEndian, true);
		assertEquals(test.alpha.beta, 0x12345678);
		assertEquals(test.beta.beta, 0x23456789);
		assertEquals(test.gamma.beta, 0x34567890);
		assertEquals(view.getUint32(off.alpha + offBeta, true), 0x12345678);
		assertEquals(view.getUint32(off.beta + offBeta, false), 0x23456789);
		assertEquals(view.getUint32(off.gamma + offBeta, true), 0x34567890);

		assertStrictEquals(test.alpha, test.alpha);
	}
	{
		const test = new TestParent(data.buffer, 0, false);
		test.alpha.beta = 0x12345678;
		test.beta.beta = 0x23456789;
		test.gamma.beta = 0x34567890;

		assertEquals(test.alpha.littleEndian, true);
		assertEquals(test.beta.littleEndian, false);
		assertEquals(test.gamma.littleEndian, false);
		assertEquals(test.alpha.beta, 0x12345678);
		assertEquals(test.beta.beta, 0x23456789);
		assertEquals(test.gamma.beta, 0x34567890);
		assertEquals(view.getUint32(off.alpha + offBeta, true), 0x12345678);
		assertEquals(view.getUint32(off.beta + offBeta, false), 0x23456789);
		assertEquals(view.getUint32(off.gamma + offBeta, false), 0x34567890);

		assertStrictEquals(test.alpha, test.alpha);
	}
});
