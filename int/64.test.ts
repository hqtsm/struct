import { assertEquals } from '@std/assert';

import { byteLength, byteOffset, getType, littleEndian } from '../macro.ts';
import { Struct } from '../struct.ts';

import { int64, uint64 } from './64.ts';

Deno.test('int64', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: bigint;

		declare public beta: bigint;

		declare public gamma: bigint;

		declare public delta: bigint;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int64(this, 'alpha', o);
			o += int64(this, 'beta', o);
			o += int64(this, 'gamma', o, true);
			o += int64(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 32);
	assertEquals(byteLength(Test, 'alpha'), 8);
	assertEquals(byteLength(Test, 'beta'), 8);
	assertEquals(byteLength(Test, 'gamma'), 8);
	assertEquals(byteLength(Test, 'delta'), 8);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'i64');
	assertEquals(getType(Test, 'beta'), 'i64');
	assertEquals(getType(Test, 'gamma'), 'i64');
	assertEquals(getType(Test, 'delta'), 'i64');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = -2n;
		test.gamma = -3n;
		test.delta = -4n;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, -2n);
		assertEquals(test.gamma, -3n);
		assertEquals(test.delta, -4n);
		assertEquals(view.getBigInt64(off.alpha, false), 0x7fffffffffffffffn);
		assertEquals(view.getBigInt64(off.beta, false), -2n);
		assertEquals(view.getBigInt64(off.gamma, true), -3n);
		assertEquals(view.getBigInt64(off.delta, false), -4n);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = -2n;
		test.gamma = -3n;
		test.delta = -4n;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, -2n);
		assertEquals(test.gamma, -3n);
		assertEquals(test.delta, -4n);
		assertEquals(view.getBigInt64(off.alpha, true), 0x7fffffffffffffffn);
		assertEquals(view.getBigInt64(off.beta, true), -2n);
		assertEquals(view.getBigInt64(off.gamma, true), -3n);
		assertEquals(view.getBigInt64(off.delta, false), -4n);
	}
});

Deno.test('uint64', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: bigint;

		declare public beta: bigint;

		declare public gamma: bigint;

		declare public delta: bigint;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint64(this, 'alpha', o);
			o += uint64(this, 'beta', o);
			o += uint64(this, 'gamma', o, true);
			o += uint64(this, 'delta', o, false);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: byteOffset(Test, 'alpha'),
		beta: byteOffset(Test, 'beta'),
		gamma: byteOffset(Test, 'gamma'),
		delta: byteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 32);
	assertEquals(byteLength(Test, 'alpha'), 8);
	assertEquals(byteLength(Test, 'beta'), 8);
	assertEquals(byteLength(Test, 'gamma'), 8);
	assertEquals(byteLength(Test, 'delta'), 8);
	assertEquals(littleEndian(Test, 'alpha'), null);
	assertEquals(littleEndian(Test, 'beta'), null);
	assertEquals(littleEndian(Test, 'gamma'), true);
	assertEquals(littleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'u64');
	assertEquals(getType(Test, 'beta'), 'u64');
	assertEquals(getType(Test, 'gamma'), 'u64');
	assertEquals(getType(Test, 'delta'), 'u64');

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = 0xfffffffffffffffen;
		test.gamma = 0xfffffffffffffffdn;
		test.delta = 0xfffffffffffffffcn;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, 0xfffffffffffffffen);
		assertEquals(test.gamma, 0xfffffffffffffffdn);
		assertEquals(test.delta, 0xfffffffffffffffcn);
		assertEquals(view.getBigUint64(off.alpha, false), 0x7fffffffffffffffn);
		assertEquals(view.getBigUint64(off.beta, false), 0xfffffffffffffffen);
		assertEquals(view.getBigUint64(off.gamma, true), 0xfffffffffffffffdn);
		assertEquals(view.getBigUint64(off.delta, false), 0xfffffffffffffffcn);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = 0xfffffffffffffffen;
		test.gamma = 0xfffffffffffffffdn;
		test.delta = 0xfffffffffffffffcn;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, 0xfffffffffffffffen);
		assertEquals(test.gamma, 0xfffffffffffffffdn);
		assertEquals(test.delta, 0xfffffffffffffffcn);
		assertEquals(view.getBigUint64(off.alpha, true), 0x7fffffffffffffffn);
		assertEquals(view.getBigUint64(off.beta, true), 0xfffffffffffffffen);
		assertEquals(view.getBigUint64(off.gamma, true), 0xfffffffffffffffdn);
		assertEquals(view.getBigUint64(off.delta, false), 0xfffffffffffffffcn);
	}
});
