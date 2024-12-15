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

Deno.test('pointer', () => {
	class Foo extends Struct {
		declare public bar: number;

		declare public baz: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'bar', o);
			o = int8(this, 'baz', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertThrows(() => array(Foo, -1), RangeError);
	assertThrows(() => array(Foo, Infinity), RangeError);
	assertThrows(() => array(Foo, Number.MAX_SAFE_INTEGER + 1), RangeError);
	assertEquals(array(Foo, 0).LENGTH, 0);
	assertEquals(array(Foo, NaN).LENGTH, 0);
	assertEquals(array(Foo, 0.5).LENGTH, 0);
	assertEquals(array(Foo, 1.1).LENGTH, 1);

	const Foo4 = array(Foo, 4);
	assertEquals(Foo4.BYTES_PER_ELEMENT, Foo.BYTE_LENGTH);
	assertEquals(Foo4.BYTE_LENGTH, Foo.BYTE_LENGTH * 4);
	assertEquals(Foo4.LENGTH, 4);
	assertStrictEquals(array(Foo, 4), Foo4);
	assertStrictEquals(Object.getPrototypeOf(Foo4), pointer(Foo));
	assertStrictEquals(array(pointer(Foo), 4), Foo4);
	assertEquals(new Foo4(new ArrayBuffer(0)).length, 4);
	assertEquals(new Foo4(new ArrayBuffer(0)).byteLength, Foo4.BYTE_LENGTH);

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

	assertEquals(getByteLength(Foo4, 0), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4, 1), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4, 2), Foo.BYTE_LENGTH * 2);
	assertEquals(getByteOffset(Foo4, -1), -Foo.BYTE_LENGTH);

	const Foo4BE = bigEndian(Foo4);
	const Foo4LE = littleEndian(Foo4BE);
	assertEquals(getByteLength(Foo4BE, 0), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4BE, 1), Foo.BYTE_LENGTH);
	assertEquals(getByteOffset(Foo4BE, 2), Foo.BYTE_LENGTH * 2);
	assertEquals(getByteOffset(Foo4BE, -1), -Foo.BYTE_LENGTH);
	assertNotStrictEquals(Foo4.MEMBERS, Foo4BE.MEMBERS);
	assertEquals(new Foo4BE(new ArrayBuffer(0)).littleEndian, false);
	assertEquals(new Foo4LE(new ArrayBuffer(0)).littleEndian, true);

	// Weird but not invalid.
	class FooExtra extends Foo4 {
		declare public extra: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'extra', o);
			return o;
		})(super.BYTE_LENGTH);
	}
	assertEquals(FooExtra.BYTE_LENGTH, Foo4.BYTE_LENGTH + 1);
});
