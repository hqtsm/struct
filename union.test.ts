import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';
import { bool32 } from './bool/32.ts';
import { LITTLE_ENDIAN } from './endian.ts';
import { int8 } from './int/8.ts';
import { int32, uint32 } from './int/32.ts';
import { Union } from './union.ts';

Deno.test('Union: buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Union(buffer).buffer, buffer);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new Union(new Uint8Array() as ArrayBufferLike),
		TypeError,
	);
});

Deno.test('Union: byteLength', () => {
	class Test extends Union {
		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new Uint8Array(16);
	assertEquals(new Test(data.buffer, 4).byteLength, 8);
});

Deno.test('Union: byteOffset', () => {
	const MAX = Number.MAX_SAFE_INTEGER;

	class Test extends Union {
		declare public alpha: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'alpha', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const buffer = new ArrayBuffer(32);
	assertEquals(new Test(buffer, 4).byteOffset, 4);
	assertEquals(new Test(buffer, 3.14).byteOffset, 3);
	assertEquals(new Test(buffer, 3.99).byteOffset, 3);
	assertEquals(new Test(buffer, Number.EPSILON).byteOffset, 0);
	assertEquals(new Test(buffer, 1 - Number.EPSILON).byteOffset, 0);
	assertEquals(new Test(buffer, NaN).byteOffset, 0);
	assertEquals(new Test(buffer, MAX).byteOffset, MAX);
	assertEquals(new Test(buffer, 32).byteOffset, 32);
	assertEquals(new Test(buffer, -1).byteOffset, -1);

	// Impossible offset throws immediately.
	assertThrows(() => new Test(buffer, MAX + 1), RangeError);
	assertThrows(() => new Test(buffer, MAX + .5), RangeError);
	assertThrows(() => new Test(buffer, Infinity), RangeError);
	assertThrows(() => new Test(buffer, -Infinity), RangeError);

	// Offset over buffer size throws lazy.
	{
		const test = new Test(buffer, 32);
		assertThrows(() => test.alpha, RangeError);
	}
	{
		const test = new Test(buffer, 33);
		assertThrows(() => test.alpha, RangeError);
	}
});

Deno.test('Union: littleEndian', () => {
	const buffer = new ArrayBuffer(32);
	assertEquals(new Union(buffer).littleEndian, LITTLE_ENDIAN);
	assertEquals(new Union(buffer, 0, true).littleEndian, true);
	assertEquals(new Union(buffer, 0, false).littleEndian, false);
});

Deno.test('Union: BYTE_LENGTH', () => {
	assertEquals(Union.BYTE_LENGTH, 0);
});

Deno.test('Union: MEMBERS', () => {
	class A extends Union {}
	class B extends A {}
	class C extends B {}

	assertStrictEquals(Object.getPrototypeOf(C).MEMBERS, B.MEMBERS);
	assertStrictEquals(Object.getPrototypeOf(B).MEMBERS, A.MEMBERS);
	assertStrictEquals(Object.getPrototypeOf(A).MEMBERS, Union.MEMBERS);
});

Deno.test('Union: protected properties', () => {
	class Test extends Union {
		declare protected alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('Union: private properties', () => {
	class Test extends Union {
		declare private alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('Union: extends', () => {
	class One extends Union {
		declare public one: number;

		public static override readonly BYTE_LENGTH: number = Math.max(
			int8(this, 'one', 0),
		);
	}

	assertEquals(One.BYTE_LENGTH, 1);

	class Two extends One {
		declare public two: number;

		public static override readonly BYTE_LENGTH: number = Math.max(
			super.BYTE_LENGTH,
			int32(this, 'two', 0),
		);
	}

	assertEquals(One.BYTE_LENGTH, 1);
	assertEquals(Two.BYTE_LENGTH, 4);

	const data = new Uint8Array(Two.BYTE_LENGTH);
	const varFloat = new Two(data.buffer, 0, true);
	varFloat.one = 8;
	assertEquals(data, new Uint8Array([8, 0, 0, 0]));
	varFloat.two = 123;
	assertEquals(data, new Uint8Array([123, 0, 0, 0]));
});

Deno.test('Union: union', () => {
	class Test extends Union {
		declare public i: number;

		declare public b: boolean;

		public static override readonly BYTE_LENGTH = Math.max(
			uint32(this, 'i', 0),
			bool32(this, 'b', 0),
		);
	}

	const test = new Test(new ArrayBuffer(Test.BYTE_LENGTH));

	test.i = 42;
	assertEquals(test.b, true);
	test.b = true;
	assertEquals(test.i, 1);
	test.i = 0;
	assertEquals(test.b, false);
	test.b = false;
	assertEquals(test.i, 0);
});
