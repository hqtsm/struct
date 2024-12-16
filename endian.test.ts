import { assertEquals, assertNotEquals, assertStrictEquals } from '@std/assert';
import {
	BIG_ENDIAN,
	bigEndian,
	defaultEndian,
	Endian,
	LITTLE_ENDIAN,
	littleEndian,
} from './endian.ts';
import { Struct } from './struct.ts';

Deno.test('BIG_ENDIAN != LITTLE_ENDIAN', () => {
	assertNotEquals(BIG_ENDIAN, LITTLE_ENDIAN);
});

Deno.test('defaultEndian', () => {
	const DE = defaultEndian(Endian);
	assertEquals(DE.LITTLE_ENDIAN, null);
	assertStrictEquals(defaultEndian(Endian), DE);
	assertEquals(
		`${new DE(new ArrayBuffer(0))}`,
		'[object DefaultEndian<Endian>]',
	);
	assertEquals(
		`${new (defaultEndian(Struct))(new ArrayBuffer(0))}`,
		'[object DefaultEndian<Struct>]',
	);
});

Deno.test('bigEndian', () => {
	const BE = bigEndian(Endian);
	assertEquals(BE.LITTLE_ENDIAN, false);
	assertStrictEquals(bigEndian(Endian), BE);
	assertEquals(
		`${new BE(new ArrayBuffer(0))}`,
		'[object BigEndian<Endian>]',
	);
	assertEquals(
		`${new (bigEndian(Struct))(new ArrayBuffer(0))}`,
		'[object BigEndian<Struct>]',
	);
});

Deno.test('littleEndian', () => {
	const LE = littleEndian(Endian);
	assertEquals(LE.LITTLE_ENDIAN, true);
	assertStrictEquals(littleEndian(Endian), LE);
	assertEquals(
		`${new LE(new ArrayBuffer(0))}`,
		'[object LittleEndian<Endian>]',
	);
	assertEquals(
		`${new (littleEndian(Struct))(new ArrayBuffer(0))}`,
		'[object LittleEndian<Struct>]',
	);
});
