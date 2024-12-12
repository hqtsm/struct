import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { LITTLE_ENDIAN } from './endian.ts';
import { int8 } from './int/8.ts';
import { member, pad } from './member.ts';
import { Struct } from './struct.ts';
import { getByteOffset } from './util.ts';
import { uint32 } from './int/32.ts';
import { bool32 } from './bool/32.ts';

Deno.test('Struct: buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Struct(buffer).buffer, buffer);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new Struct(new Uint8Array() as ArrayBufferLike),
		TypeError,
	);
});

Deno.test('Struct: byteLength', () => {
	class Test extends Struct {
		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new Uint8Array(16);
	assertEquals(new Test(data.buffer, 4).byteLength, 8);
});

Deno.test('Struct: byteOffset', () => {
	const MAX = Number.MAX_SAFE_INTEGER;

	class Test extends Struct {
		declare public alpha: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha', o);
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

Deno.test('Struct: littleEndian', () => {
	const buffer = new ArrayBuffer(32);
	assertEquals(new Struct(buffer).littleEndian, LITTLE_ENDIAN);
	assertEquals(new Struct(buffer, 0, true).littleEndian, true);
	assertEquals(new Struct(buffer, 0, false).littleEndian, false);
});

Deno.test('Struct: BYTE_LENGTH', () => {
	assertEquals(Struct.BYTE_LENGTH, 0);
});

Deno.test('Struct: MEMBERS', () => {
	class A extends Struct {}
	class B extends A {}
	class C extends B {}

	assertStrictEquals(Object.getPrototypeOf(C).MEMBERS, B.MEMBERS);
	assertStrictEquals(Object.getPrototypeOf(B).MEMBERS, A.MEMBERS);
	assertStrictEquals(Object.getPrototypeOf(A).MEMBERS, Struct.MEMBERS);
});

Deno.test('Struct: protected properties', () => {
	class Test extends Struct {
		declare protected alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('Struct: private properties', () => {
	class Test extends Struct {
		declare private alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('Struct: extends', () => {
	class Var extends Struct {
		declare public type: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'type', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class Int8 extends Var {
		declare public value: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Int8.BYTE_LENGTH);
	const varFloat = new Int8(data.buffer, 0, true);
	varFloat.type = 8;
	varFloat.value = 123;
	assertEquals(data, new Uint8Array([8, 123]));
});

Deno.test('Struct: abstract', () => {
	abstract class Member extends Struct {
		declare public value: number;

		public abstract method(): number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	class Test extends Struct {
		declare public child: MemberImp;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += member(MemberImp, this, 'child', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer, 0, true);
	test.child.value = 123;
	assertEquals(data, new Uint8Array([123]));
});

Deno.test('Struct: abstract placeholder', () => {
	abstract class Member extends Struct {
		declare public value: number;

		public abstract method(): number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	abstract class Test extends Struct {
		declare public child: Member;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += pad(Member.BYTE_LENGTH, this, 'child' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestImp extends Test {
		declare public child: Member;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += member(MemberImp, this, 'child', getByteOffset(this, 'child'));
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new TestImp(data.buffer, 0, true);
	test.child.value = 123;
	assertEquals(data, new Uint8Array([123]));
});

Deno.test('Struct: union', () => {
	class Test extends Struct {
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
