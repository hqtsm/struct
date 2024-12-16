import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';
import { array } from './arr.ts';
import { bigEndian, littleEndian } from './endian.ts';
import { int8 } from './int/8.ts';
import { pointer } from './ptr.ts';
import { Struct } from './struct.ts';
import { getByteLength, getByteOffset } from './util.ts';
import { Uint8Ptr } from './mod.ts';

class Foo extends Struct {
	declare public bar: number;

	declare public baz: number;

	static {
		int8(this, 'bar');
		int8(this, 'baz');
	}
}

const Foo4 = array(Foo, 4);

Deno.test('array: lengths', () => {
	assertThrows(() => array(Foo, -1), RangeError);
	assertThrows(() => array(Foo, Infinity), RangeError);
	assertThrows(() => array(Foo, Number.MAX_SAFE_INTEGER + 1), RangeError);
	assertEquals(array(Foo, 0).LENGTH, 0);
	assertEquals(array(Foo, NaN).LENGTH, 0);
	assertEquals(array(Foo, 0.5).LENGTH, 0);
	assertEquals(array(Foo, 1.1).LENGTH, 1);

	assertEquals(Foo4.BYTES_PER_ELEMENT, Foo.BYTE_LENGTH);
	assertEquals(Foo4.BYTE_LENGTH, Foo.BYTE_LENGTH * 4);
	assertEquals(Foo4.LENGTH, 4);
	assertStrictEquals(array(Foo, 4), Foo4);
	assertStrictEquals(Object.getPrototypeOf(Foo4), pointer(Foo));
	assertStrictEquals(array(pointer(Foo), 4), Foo4);
	assertEquals(new Foo4(new ArrayBuffer(0)).length, 4);
	assertEquals(new Foo4(new ArrayBuffer(0)).byteLength, Foo4.BYTE_LENGTH);

	assertEquals(getByteLength(Foo4, 0), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4, 1), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4, 2), Foo.BYTE_LENGTH * 2);
	assertEquals(getByteOffset(Foo4, -1), -Foo.BYTE_LENGTH);
});

Deno.test('array: values', () => {
	const data = new Uint8Array(Foo.BYTE_LENGTH * 3);
	const foo4 = new Foo4(data.buffer, Foo.BYTE_LENGTH);
	{
		foo4[-1].bar = -2;
		foo4[-1].baz = -1;
		assertStrictEquals(foo4[-1], foo4[-1]);
	}
	{
		foo4[0].bar = 1;
		foo4[0].baz = 2;
		assertStrictEquals(foo4[0], foo4[0]);
	}
	{
		const tmp = new Foo(new ArrayBuffer(Foo.BYTE_LENGTH));
		tmp.bar = 3;
		tmp.baz = 4;
		foo4[1] = tmp;
		assertNotStrictEquals(foo4[1], tmp);
	}
	assertEquals(data, new Uint8Array([-2, -1, 1, 2, 3, 4]));
});

Deno.test('array: endian', () => {
	const Foo4BE = bigEndian(Foo4);
	const Foo4LE = littleEndian(Foo4BE);
	assertEquals(getByteLength(Foo4BE, 0), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4BE, 1), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4BE, 2), Foo.BYTE_LENGTH * 2);
	assertEquals(getByteOffset(Foo4BE, -1), -Foo.BYTE_LENGTH);
	assertNotStrictEquals(Foo4.MEMBERS, Foo4BE.MEMBERS);
	assertEquals(new Foo4BE(new ArrayBuffer(0)).littleEndian, false);
	assertEquals(new Foo4LE(new ArrayBuffer(0)).littleEndian, true);
});

Deno.test('array: Symbol.iterator', () => {
	const data = new Uint8Array(Foo.BYTE_LENGTH * 3);
	const foo4 = new Foo4(data.buffer, Foo.BYTE_LENGTH);

	const list = [...foo4];
	let i = 0;
	for (const foo of foo4) {
		assertStrictEquals(foo, foo4[i]);
		assertStrictEquals(foo, list[i]);
		i++;
	}
	assertEquals(list.length, foo4.length);
});

Deno.test('array: entries', () => {
	const data = new Uint8Array(Foo.BYTE_LENGTH * 3);
	const foo4 = new Foo4(data.buffer, Foo.BYTE_LENGTH);

	const list = [...foo4.entries()];
	let i = 0;
	for (const [k, v] of foo4.entries()) {
		assertStrictEquals(k, list[i][0]);
		assertStrictEquals(v, list[i][1]);
		i++;
	}
	assertEquals(list.length, 4);
});

Deno.test('array: keys', () => {
	const data = new Uint8Array(Foo.BYTE_LENGTH * 3);
	const foo4 = new Foo4(data.buffer, Foo.BYTE_LENGTH);

	const list = [...foo4.keys()];
	let i = 0;
	for (const foo of foo4.keys()) {
		assertStrictEquals(foo, i);
		i++;
	}
	assertEquals(list, [0, 1, 2, 3]);
});

Deno.test('array: values', () => {
	const data = new Uint8Array(Foo.BYTE_LENGTH * 3);
	const foo4 = new Foo4(data.buffer, Foo.BYTE_LENGTH);

	const list = [...foo4.values()];
	let i = 0;
	for (const foo of foo4.values()) {
		assertStrictEquals(foo, foo4[i]);
		assertStrictEquals(foo, list[i]);
		i++;
	}
	assertEquals(list.length, foo4.length);
});

Deno.test('array: at', () => {
	const jsar = [1, 2, 3, 4];
	const data = new Uint8Array(jsar);
	const Four = array(Uint8Ptr, 4);
	const four = new Four(data.buffer);

	for (
		const index of [
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			[-1, -2, -3, -4, -5, -6, -7, -8, -9, -10],
			[Infinity, -Infinity, NaN, Number.EPSILON, -Number.EPSILON],
			[1.1, 0.5, -1.1, -0.5, -0],
			['1', '', 'invalid'],
		].flat() as number[]
	) {
		assertStrictEquals(four.at(index), jsar.at(index), `at(${index})`);
	}
});

Deno.test('array: extend', () => {
	// Weird but not invalid.
	class FooExtra extends Foo4 {
		declare public extra: number;

		static {
			int8(this, 'extra');
		}
	}
	assertEquals(FooExtra.BYTE_LENGTH, Foo4.BYTE_LENGTH + 1);
});
