import {
	assertEquals,
	assertMatch,
	assertNotEquals,
	assertStrictEquals,
} from '@std/assert';
import {
	BIG_ENDIAN,
	bigEndian,
	dynamicEndian,
	Endian,
	LITTLE_ENDIAN,
	littleEndian,
} from './endian.ts';
import { Struct } from './struct.ts';

abstract class AbstractChild extends Endian {}
const defaultClassProperties = new Set(Object.getOwnPropertyNames(class {}));

Deno.test('BIG_ENDIAN != LITTLE_ENDIAN', () => {
	assertNotEquals(BIG_ENDIAN, LITTLE_ENDIAN);
});

Deno.test('dynamicEndian', () => {
	const DE = dynamicEndian(Endian);
	assertEquals(DE.LITTLE_ENDIAN, null);
	assertStrictEquals(dynamicEndian(Endian), DE);
	assertEquals(
		`${new DE(new ArrayBuffer(0))}`,
		'[object DynamicEndian<Endian>]',
	);
	assertEquals(
		`${new (dynamicEndian(Struct))(new ArrayBuffer(0))}`,
		'[object DynamicEndian<Struct>]',
	);
	for (const p of Object.getOwnPropertyNames(DE)) {
		if (defaultClassProperties.has(p)) {
			continue;
		}
		const desc = Object.getOwnPropertyDescriptor(DE, p);
		assertMatch(p, /^[A-Z][A-Z0-9_]*$/, p);
		assertEquals(desc!.writable ?? false, false, p);
	}

	dynamicEndian(AbstractChild);

	// @ts-expect-error: Class but not function.
	dynamicEndian(Function);
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
	for (const p of Object.getOwnPropertyNames(BE)) {
		if (defaultClassProperties.has(p)) {
			continue;
		}
		const desc = Object.getOwnPropertyDescriptor(BE, p);
		assertMatch(p, /^[A-Z][A-Z0-9_]*$/, p);
		assertEquals(desc!.writable ?? false, false, p);
	}

	bigEndian(AbstractChild);

	// @ts-expect-error: Class but not function.
	bigEndian(Function);
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
	for (const p of Object.getOwnPropertyNames(LE)) {
		if (defaultClassProperties.has(p)) {
			continue;
		}
		const desc = Object.getOwnPropertyDescriptor(LE, p);
		assertMatch(p, /^[A-Z][A-Z0-9_]*$/, p);
		assertEquals(desc!.writable ?? false, false, p);
	}

	littleEndian(AbstractChild);

	// @ts-expect-error: Class but not function.
	littleEndian(Function);
});
