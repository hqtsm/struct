import { assertEquals } from '@std/assert';
import { type Arr, array } from './arr.ts';
import { bool8 } from './bool/8.ts';
import type { Const } from './const.ts';
import { uint8, Uint8Ptr } from './int/8.ts';
import { member } from './member.ts';
import { pointer } from './ptr.ts';
import { Struct } from './struct.ts';

Deno.test('Const<Struct>', () => {
	class Child extends Struct {
		declare public a: number;
		declare public b: boolean;

		static {
			uint8(this, 'a');
			bool8(this, 'b');
		}
	}

	class Parent extends Struct {
		declare public a: number;
		declare public b: boolean;
		declare public c: Child;

		static {
			uint8(this, 'a');
			bool8(this, 'b');
			member(Child, this, 'c');
		}
	}

	const data = new Uint8Array(Parent.BYTE_LENGTH);
	const stru: Const<Parent> = new Parent(data.buffer);

	// @ts-expect-error: Readonly.
	stru.a = 97;

	// @ts-expect-error: Readonly.
	stru.b = true;

	// @ts-expect-error: Readonly.
	stru.c.a = 65;

	// @ts-expect-error: Readonly.
	stru.c.b = true;

	assertEquals(stru.a, 97);
	assertEquals(stru.b, true);
	assertEquals(stru.c.a, 65);
	assertEquals(stru.c.b, true);
});

Deno.test('Const<Ptr<number>>', () => {
	const data = new Uint8Array(2);
	const ptr: Const<Uint8Ptr> = new Uint8Ptr(data.buffer);

	// @ts-expect-error: Readonly.
	ptr[0] = 1;

	// @ts-expect-error: Readonly.
	ptr.set(1, 2);

	assertEquals(ptr.get(0), 1);
	assertEquals(ptr[1], 2);
});

Deno.test('Const<Ptr<number>> Extended', () => {
	class Uint8PtrEx extends Uint8Ptr {
		public extra = 123;
	}

	const data = new Uint8Array(2);
	const ptr: Const<Uint8PtrEx> = new Uint8PtrEx(data.buffer);

	// @ts-expect-error: Readonly.
	ptr[0] = 1;

	// @ts-expect-error: Readonly.
	ptr.set(1, 2);

	// @ts-expect-error: Readonly.
	ptr.extra = 456;

	assertEquals(ptr.get(0), 1);
	assertEquals(ptr[1], 2);
	assertEquals(ptr.extra, 456);
});

Deno.test('Const<Arr<number>>', () => {
	const A2 = array(Uint8Ptr, 2);
	const data = new Uint8Array(A2.BYTE_LENGTH);
	const ptr: Const<Arr<number>> = new A2(data.buffer);

	// @ts-expect-error: Readonly.
	ptr[0] = 1;

	// @ts-expect-error: Readonly.
	ptr.set(1, 2);

	assertEquals(ptr.get(0), 1);
	assertEquals(ptr[1], 2);
});

Deno.test('Const<Arr<number>> Extended', () => {
	class A2 extends array(Uint8Ptr, 2) {
		public extra = 123;
	}

	const data = new Uint8Array(A2.BYTE_LENGTH);
	const ptr: Const<A2> = new A2(data.buffer);

	// @ts-expect-error: Readonly.
	ptr[0] = 1;

	// @ts-expect-error: Readonly.
	ptr.set(1, 2);

	// @ts-expect-error: Readonly.
	ptr.extra = 456;

	assertEquals(ptr.get(0), 1);
	assertEquals(ptr[1], 2);
	assertEquals(ptr.extra, 456);
});

Deno.test('Const<Struct> Extras', () => {
	const sym = Symbol('sym');

	class Test extends Struct {
		declare public a: number;
		declare public b: boolean;

		public obj = { a: 1, b: 2, c: 3 };
		public arr = [1, 2, 3];
		public unk: unknown = 'unknown';
		public [sym] = sym;
		public tup: [number, boolean] = [1, true];
		public set = new Set([1]);
		public map = new Map([[0, false], [1, true]]);
		declare public nev: never;

		static {
			uint8(this, 'a');
			bool8(this, 'b');
		}
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const stru: Const<Test> = new Test(data.buffer);

	assertEquals(stru.a, 0);
	assertEquals(stru.b, false);

	assertEquals(stru.obj, { a: 1, b: 2, c: 3 });
	assertEquals(stru.arr, [1, 2, 3]);
	assertEquals(stru.unk, 'unknown');
	assertEquals(stru[sym], sym);
	assertEquals(stru.tup[0] satisfies number, 1);
	assertEquals(stru.tup[1] satisfies boolean, true);
	assertEquals([...stru.set], [1]);
	assertEquals([...stru.map], [[0, false], [1, true]]);
	assertEquals(stru.nev, undefined);
});

Deno.test('Const<Arr<Struct>>', () => {
	class Test extends Struct {
		declare public a: number;
		declare public b: number;

		static {
			uint8(this, 'a');
			uint8(this, 'b');
		}
	}

	const TestPtr = pointer(Test);
	const Test2 = array(TestPtr, 2);

	const data = new Uint8Array(Test2.BYTE_LENGTH);
	const stru: Const<Arr<Test>> = new Test2(data.buffer);

	const zero = stru.get(0);
	const one = stru.at(1);

	// @ts-expect-error: Readonly.
	stru[0].a = 1;

	// @ts-expect-error: Readonly.
	stru[0].b = 2;

	// @ts-expect-error: Readonly.
	one.a = 11;

	// @ts-expect-error: Readonly.
	one.b = 12;

	for (const s of stru) {
		// @ts-expect-error: Readonly.
		s.a++;
	}

	for (const s of stru.values()) {
		// @ts-expect-error: Readonly.
		s.a -= 2;
	}

	for (const [, s] of stru.entries()) {
		// @ts-expect-error: Readonly.
		s.a += 1;
	}

	assertEquals(zero.a, 1);
	assertEquals(zero.b, 2);
	assertEquals(stru[1].a, 11);
	assertEquals(stru[1].b, 12);
});
