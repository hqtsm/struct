import {
	assertEquals,
	assertInstanceOf,
	assertNotStrictEquals,
} from '@std/assert';

import { endianSwap } from './macro.ts';
import { Struct } from './struct.ts';

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
