import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import { int64, Int64Ptr, uint64, Uint64Ptr } from './64.ts';

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

Deno.test('Int64Ptr', () => {
	const bpe = Int64Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 8);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Int64Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1n;
			assertEquals(view.getBigInt64(o, ptr.littleEndian), -1n);
			view.setBigInt64(o, 1n, ptr.littleEndian);
			assertEquals(ptr[i], 1n);
		}
	}
});

Deno.test('Uint64Ptr', () => {
	const bpe = Uint64Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 8);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Uint64Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1n;
			assertEquals(
				view.getBigUint64(o, ptr.littleEndian),
				0xffffffffffffffffn,
			);
			view.setBigUint64(o, 1n, ptr.littleEndian);
			assertEquals(ptr[i], 1n);
		}
	}
});
