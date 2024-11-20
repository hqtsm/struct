import {
	assert,
	assertEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';

import { Struct } from './struct.ts';
import { LITTLE_ENDIAN } from './const.ts';

Deno.test('buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Struct(buffer).buffer, buffer);
});

Deno.test('byteLength', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new Uint8Array(16);
	assertEquals(new Test(data.buffer, 4).byteLength, 8);
});

Deno.test('byteOffset', () => {
	const data = new ArrayBuffer(32);
	assertEquals(new Struct(data, 4).byteOffset, 4);
	assertEquals(new Struct(data, 3.14).byteOffset, 3);
	assertEquals(new Struct(data, 32).byteOffset, 32);
	assertThrows(() => new Struct(data, -1), RangeError);
	assertThrows(() => new Struct(data, 33), RangeError);
});

Deno.test('dataView', () => {
	const data = new ArrayBuffer(32);
	{
		const test = new Struct(data);
		assertStrictEquals(test.dataView, test.dataView);
	}
	assertEquals(new Struct(data, 16).dataView.byteOffset, 16);
	assertEquals(new Struct(data, 4).dataView.byteOffset, 4);
	assertEquals(new Struct(data, 3.14).dataView.byteOffset, 3);
	assertEquals(new Struct(data, 32).dataView.byteOffset, 32);
	{
		const test = new Struct(data, 16);
		test.dataView.setUint8(0, 42);
		assertEquals(new Uint8Array(data)[16], 42);
	}
});

Deno.test('littleEndian', () => {
	const data = new ArrayBuffer(32);
	assertEquals(new Struct(data).littleEndian, LITTLE_ENDIAN);
	assertEquals(new Struct(data, 0, true).littleEndian, true);
	assertEquals(new Struct(data, 0, false).littleEndian, false);
});

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Struct.BYTE_LENGTH, 0);
});

Deno.test('MEMBERS', () => {
	assertEquals(Object.keys(Struct.MEMBERS).length, 0);
	assert(Object.hasOwn(Struct, 'MEMBERS'));
});
