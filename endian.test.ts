import { assertEquals, assertNotEquals, assertStrictEquals } from '@std/assert';

import {
	BIG_ENDIAN,
	bigEndian,
	Endian,
	LITTLE_ENDIAN,
	littleEndian,
	nativeEndian,
} from './endian.ts';

Deno.test('BIG_ENDIAN != LITTLE_ENDIAN', () => {
	assertNotEquals(BIG_ENDIAN, LITTLE_ENDIAN);
});

Deno.test('bigEndian', () => {
	const BE = bigEndian(Endian);
	assertEquals(BE.LITTLE_ENDIAN, false);
	assertStrictEquals(bigEndian(Endian), BE);
});

Deno.test('littleEndian', () => {
	const LE = littleEndian(Endian);
	assertEquals(LE.LITTLE_ENDIAN, true);
	assertStrictEquals(littleEndian(Endian), LE);
});

Deno.test('nativeEndian', () => {
	const NE = nativeEndian(Endian);
	assertEquals(NE.LITTLE_ENDIAN, null);
	assertStrictEquals(nativeEndian(Endian), NE);
});
