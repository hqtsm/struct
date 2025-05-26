import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';
import { LITTLE_ENDIAN } from './endian.ts';
import { int8 } from './int/8.ts';
import { member, pad } from './member.ts';
import { Struct } from './struct.ts';
import { getByteOffset } from './util.ts';

Deno.test('Struct: buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Struct(buffer).buffer, buffer);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new Struct(new Uint8Array() as unknown as ArrayBufferLike),
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

Deno.test('Struct: Symbol.toStringTag', () => {
	class A extends Struct {}

	assertEquals(
		`${new Struct(new ArrayBuffer(0))}`,
		`[object ${Struct.name}]`,
	);
	assertEquals(
		`${new A(new ArrayBuffer(0))}`,
		`[object ${Struct.name}]`,
	);
});

Deno.test('Struct: protected properties', () => {
	class Test extends Struct {
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

Deno.test('Struct: private properties', () => {
	class Test extends Struct {
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

	class Test extends Struct {
		declare public [symPub]: number;

		declare protected [symPro]: number;

		declare private [symPri]: number;

		static {
			int8(this, symPub);
			int8(this, symPro as never);
			int8(this, symPri as never);
		}
	}

	const test = new Test(new Uint8Array([1, 2, 3]).buffer);
	assertEquals(test[symPub], 1);
	assertEquals(test[symPro], 2);
	assertEquals(test[symPri], 3);
});

Deno.test('Struct: extends', () => {
	class Var extends Struct {
		declare public type: number;

		static {
			int8(this, 'type');
		}
	}

	class Int8 extends Var {
		declare public value: number;

		static {
			int8(this, 'value');
		}
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

		static {
			int8(this, 'value');
		}
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	class Test extends Struct {
		declare public child: MemberImp;

		static {
			member(MemberImp, this, 'child');
		}
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

		static {
			int8(this, 'value');
		}
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	abstract class Test extends Struct {
		declare public child: Member;

		static {
			pad(Member.BYTE_LENGTH, this, 'child' as never);
		}
	}

	class TestImp extends Test {
		declare public child: Member;

		static {
			member(MemberImp, this, 'child', getByteOffset(this, 'child'));
		}
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new TestImp(data.buffer, 0, true);
	test.child.value = 123;
	assertEquals(data, new Uint8Array([123]));
});
