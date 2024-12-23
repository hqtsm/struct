import {
	assertEquals,
	assertMatch,
	assertNotStrictEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';
import { array } from './arr.ts';
import { bigEndian, littleEndian } from './endian.ts';
import { int8 } from './int/8.ts';
import { pointer, Ptr } from './ptr.ts';
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

Deno.test('Arr: lengths', () => {
	assertThrows(() => array(Foo, -1), RangeError);
	assertThrows(() => array(Foo, Infinity), RangeError);
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

Deno.test('Arr: values', () => {
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

Deno.test('Arr: endian', () => {
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

Deno.test('Arr: constants', () => {
	const defaultClassProperties = new Set(
		Object.getOwnPropertyNames(class {}),
	);

	for (const p of Object.getOwnPropertyNames(Foo4)) {
		if (defaultClassProperties.has(p)) {
			continue;
		}
		const desc = Object.getOwnPropertyDescriptor(Foo4, p);
		assertMatch(p, /^[A-Z][A-Z0-9_]*$/, p);
		assertEquals(desc!.writable ?? false, false, p);
	}
});

Deno.test('Arr: Symbol.toStringTag', () => {
	assertEquals(
		`${new Foo4(new ArrayBuffer(0))}`,
		`[object ${Ptr.name}<${Struct.name}>[4]]`,
	);
});

Deno.test('Arr: Symbol.iterator', () => {
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

Deno.test('Arr: entries', () => {
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

Deno.test('Arr: keys', () => {
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

Deno.test('Arr: values', () => {
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

Deno.test('Arr: at', () => {
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

Deno.test('Arr: extend', () => {
	// Weird but not invalid.
	class FooExtra extends Foo4 {
		declare public extra: number;

		static {
			int8(this, 'extra');
		}
	}

	assertEquals(FooExtra.BYTE_LENGTH, Foo4.BYTE_LENGTH + 1);
});

Deno.test('Arr: 2d int', () => {
	const TwoD = array(array(Uint8Ptr, 2), 4);
	assertEquals(TwoD.BYTE_LENGTH, 8);

	const data = new Uint8Array(TwoD.BYTE_LENGTH);
	const twoD = new TwoD(data.buffer);
	assertEquals(twoD.byteLength, TwoD.BYTE_LENGTH);
	assertEquals(twoD.length, 4);
	assertEquals(twoD[0].byteLength, 2);
	assertEquals(twoD[1].byteLength, 2);

	twoD[0][0] = 1;
	twoD[0][1] = 2;
	twoD[1][0] = 13;
	twoD[1][1] = 14;
	twoD[2] = twoD[1];
	twoD[3] = twoD[0];
	assertEquals(data, new Uint8Array([1, 2, 13, 14, 13, 14, 1, 2]));
});

Deno.test('Arr: 2d struct', () => {
	const Foo4x2 = array(Foo4, 2);
	assertEquals(Foo4x2.BYTE_LENGTH, Foo4.BYTE_LENGTH * 2);

	const data = new Uint8Array(Foo4x2.BYTE_LENGTH);
	const foo4x2 = new Foo4x2(data.buffer);
	assertEquals(foo4x2.byteLength, Foo4x2.BYTE_LENGTH);
	assertEquals(foo4x2.length, 2);
	assertEquals(foo4x2[0].byteLength, Foo4.BYTE_LENGTH);
	assertEquals(foo4x2[1].byteLength, Foo4.BYTE_LENGTH);

	let v = 1;
	for (let i = 0; i < foo4x2.length; i++) {
		for (let j = 0; j < foo4x2[i].length; j++) {
			foo4x2[i][j].bar = v++;
			foo4x2[i][j].baz = v++;
		}
	}

	assertEquals(
		data,
		new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
	);
});
