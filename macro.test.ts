import {
	assertEquals,
	assertInstanceOf,
	assertNotStrictEquals,
	assertThrows,
} from '@std/assert';

import { assignStruct, assignView, endianSwap } from './macro.ts';
import { Struct } from './struct.ts';
import { uint8 } from './member/i8.ts';

Deno.test('endianSwap', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;
	}

	const le = new Test(new ArrayBuffer(0), 0, true);
	const be = new Test(new ArrayBuffer(0), 0, false);

	const leSwap = endianSwap(le);
	const leSwapLe = endianSwap(le, true);
	const leSwapBe = endianSwap(le, false);

	const beSwap = endianSwap(be);
	const beSwapLe = endianSwap(be, true);
	const beSwapBe = endianSwap(be, false);

	assertInstanceOf(leSwap, Test);
	assertInstanceOf(leSwapLe, Test);
	assertInstanceOf(leSwapBe, Test);

	assertInstanceOf(beSwap, Test);
	assertInstanceOf(beSwapLe, Test);
	assertInstanceOf(beSwapBe, Test);

	assertEquals(leSwap.littleEndian, false);
	assertEquals(leSwapLe.littleEndian, true);
	assertEquals(leSwapBe.littleEndian, false);

	assertEquals(beSwap.littleEndian, true);
	assertEquals(beSwapLe.littleEndian, true);
	assertEquals(beSwapBe.littleEndian, false);

	assertNotStrictEquals(leSwap, le);
	assertNotStrictEquals(leSwapLe, le);
	assertNotStrictEquals(leSwapBe, le);

	assertNotStrictEquals(beSwap, be);
	assertNotStrictEquals(beSwapLe, be);
	assertNotStrictEquals(beSwapBe, be);
});

Deno.test('assignView', () => {
	const src = new Uint8Array([0xff, 0xfe, 0xfd, 0xfc]);
	const dst = new Int8Array(src.length);
	assignView(dst.subarray(1, 3), src.subarray(2, 4));
	assertEquals(dst, new Int8Array([0, -3, -4, 0]));
	assertThrows(() => assignView(dst, src.slice(1)), RangeError);
});

Deno.test('assignStruct', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint8(this, 'alpha', o);
			o += uint8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestExt extends Test {
		declare public readonly ['constructor']: typeof TestExt;

		declare public gamma: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint8(this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	{
		const src = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 1), 1);
		src.alpha = 65;
		src.beta = 66;
		const dst = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 2), 2);
		assignStruct(dst, src);
		assertEquals(dst.alpha, 65);
		assertEquals(dst.beta, 66);
	}

	{
		const src = new TestExt(new ArrayBuffer(TestExt.BYTE_LENGTH + 1), 1);
		src.alpha = 65;
		src.beta = 66;
		src.gamma = 71;
		const dst = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 2), 2);
		assignStruct(dst, src);
		assertEquals(dst.alpha, 65);
		assertEquals(dst.beta, 66);
	}
});
