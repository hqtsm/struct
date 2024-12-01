import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import {
	getByteLength,
	getByteOffset,
	getLittleEndian,
	getType,
} from '../util.ts';
import { int64, uint64 } from './64.ts';

Deno.test('int64', () => {
	class Test extends Struct {
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
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 32);
	assertEquals(getByteLength(Test, 'alpha'), 8);
	assertEquals(getByteLength(Test, 'beta'), 8);
	assertEquals(getByteLength(Test, 'gamma'), 8);
	assertEquals(getByteLength(Test, 'delta'), 8);
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'int64');
	assertEquals(getType(Test, 'beta'), 'int64');
	assertEquals(getType(Test, 'gamma'), 'int64');
	assertEquals(getType(Test, 'delta'), 'int64');

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
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 32);
	assertEquals(getByteLength(Test, 'alpha'), 8);
	assertEquals(getByteLength(Test, 'beta'), 8);
	assertEquals(getByteLength(Test, 'gamma'), 8);
	assertEquals(getByteLength(Test, 'delta'), 8);
	assertEquals(getLittleEndian(Test, 'alpha'), null);
	assertEquals(getLittleEndian(Test, 'beta'), null);
	assertEquals(getLittleEndian(Test, 'gamma'), true);
	assertEquals(getLittleEndian(Test, 'delta'), false);
	assertEquals(getType(Test, 'alpha'), 'uint64');
	assertEquals(getType(Test, 'beta'), 'uint64');
	assertEquals(getType(Test, 'gamma'), 'uint64');
	assertEquals(getType(Test, 'delta'), 'uint64');

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
