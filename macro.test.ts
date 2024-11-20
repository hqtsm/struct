import { assertEquals } from '@std/assert';

import { endianSwap } from './macro.ts';
import { Struct } from './struct.ts';

Deno.test('endianSwap', () => {
	const le = new Struct(new ArrayBuffer(0), 0, true);
	const be = new Struct(new ArrayBuffer(0), 0, false);
	assertEquals(endianSwap(le).littleEndian, false);
	assertEquals(endianSwap(le, true).littleEndian, true);
	assertEquals(endianSwap(le, false).littleEndian, false);
	assertEquals(endianSwap(be).littleEndian, true);
	assertEquals(endianSwap(be, true).littleEndian, true);
	assertEquals(endianSwap(be, false).littleEndian, false);
});
