import { assertEquals } from '@std/assert';

import { Struct } from '../struct.ts';
import { memberI64, memberU64 } from './i64.ts';

Deno.test('memberI64', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: bigint;

		declare public beta: bigint;

		declare public gamma: bigint;

		declare public delta: bigint;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberI64(this, o, 'alpha');
			o += memberI64(this, o, 'beta');
			o += memberI64(this, o, 'gamma', true);
			o += memberI64(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 32);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = -2n;
		test.gamma = -3n;
		test.delta = -4n;

		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, -2n);
		assertEquals(test.gamma, -3n);
		assertEquals(test.delta, -4n);
		assertEquals(view.getBigInt64(0, false), 0x7fffffffffffffffn);
		assertEquals(view.getBigInt64(8, false), -2n);
		assertEquals(view.getBigInt64(16, true), -3n);
		assertEquals(view.getBigInt64(24, false), -4n);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = -2n;
		test.gamma = -3n;
		test.delta = -4n;

		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, -2n);
		assertEquals(test.gamma, -3n);
		assertEquals(test.delta, -4n);
		assertEquals(view.getBigInt64(0, true), 0x7fffffffffffffffn);
		assertEquals(view.getBigInt64(8, true), -2n);
		assertEquals(view.getBigInt64(16, true), -3n);
		assertEquals(view.getBigInt64(24, false), -4n);
	}
});

Deno.test('memberU64', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: bigint;

		declare public beta: bigint;

		declare public gamma: bigint;

		declare public delta: bigint;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += memberU64(this, o, 'alpha');
			o += memberU64(this, o, 'beta');
			o += memberU64(this, o, 'gamma', true);
			o += memberU64(this, o, 'delta', false);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Test.BYTE_LENGTH, 32);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = 0xfffffffffffffffen;
		test.gamma = 0xfffffffffffffffdn;
		test.delta = 0xfffffffffffffffcn;

		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, 0xfffffffffffffffen);
		assertEquals(test.gamma, 0xfffffffffffffffdn);
		assertEquals(test.delta, 0xfffffffffffffffcn);
		assertEquals(view.getBigUint64(0, false), 0x7fffffffffffffffn);
		assertEquals(view.getBigUint64(8, false), 0xfffffffffffffffen);
		assertEquals(view.getBigUint64(16, true), 0xfffffffffffffffdn);
		assertEquals(view.getBigUint64(24, false), 0xfffffffffffffffcn);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fffffffffffffffn;
		test.beta = 0xfffffffffffffffen;
		test.gamma = 0xfffffffffffffffdn;
		test.delta = 0xfffffffffffffffcn;

		assertEquals(test.alpha, 0x7fffffffffffffffn);
		assertEquals(test.beta, 0xfffffffffffffffen);
		assertEquals(test.gamma, 0xfffffffffffffffdn);
		assertEquals(test.delta, 0xfffffffffffffffcn);
		assertEquals(view.getBigUint64(0, true), 0x7fffffffffffffffn);
		assertEquals(view.getBigUint64(8, true), 0xfffffffffffffffen);
		assertEquals(view.getBigUint64(16, true), 0xfffffffffffffffdn);
		assertEquals(view.getBigUint64(24, false), 0xfffffffffffffffcn);
	}
});
