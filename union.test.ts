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
		() => new Union(new Uint8Array() as unknown as ArrayBufferLike),
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

		static {
			int8(this, 'alpha');
		}
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

Deno.test('Struct: Symbol.toStringTag', () => {
	class A extends Union {}

	assertEquals(
		`${new Union(new ArrayBuffer(0))}`,
		`[object ${Union.name}]`,
	);
	assertEquals(
		`${new A(new ArrayBuffer(0))}`,
		`[object ${Union.name}]`,
	);
});

Deno.test('Union: protected properties', () => {
	class Test extends Union {
		declare protected alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		static {
			int8(this, 'alpha' as never);
		}
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

		static {
			int8(this, 'alpha' as never);
		}
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('Struct: symbol properties', () => {
	const symPub = Symbol('public');
	const symPro = Symbol('protected');
	const symPri = Symbol('private');

	class Test extends Union {
		declare public [symPub]: number;

		declare protected [symPro]: number;

		declare private [symPri]: number;

		static {
			int8(this, symPub);
			int8(this, symPro as never);
			int8(this, symPri as never);
		}
	}

	const test = new Test(new Uint8Array([123]).buffer);
	assertEquals(test[symPub], 123);
	assertEquals(test[symPro], 123);
	assertEquals(test[symPri], 123);
});

Deno.test('Union: extends', () => {
	class One extends Union {
		declare public one: number;

		static {
			int8(this, 'one');
		}
	}

	assertEquals(One.BYTE_LENGTH, 1);

	class Two extends One {
		declare public two: number;

		static {
			int32(this, 'two');
		}
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

		static {
			uint32(this, 'i');
			bool32(this, 'b');
		}
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
