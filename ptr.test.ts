import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
	assertThrows,
} from '@std/assert';

import { LITTLE_ENDIAN } from './endian.ts';
import { int8, Uint8Ptr } from './int/8.ts';
import { pointer, Ptr } from './ptr.ts';
import { Struct } from './struct.ts';
import type { MemberInfos } from './type.ts';

class DummyPtr extends Ptr<number> {
	public override get(index: number): number {
		throw new Error(`Getter: [${index}]`);
	}

	public override set(index: number, value: number): void {
		throw new Error(`Setter: [${index}] = ${String(value)}`);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}

Deno.test('Ptr: MEMBERS', () => {
	assertEquals(typeof Ptr.MEMBERS['unknown'], 'undefined');
	assertEquals(typeof Ptr.MEMBERS[1.5], 'undefined');
	assertEquals(typeof Ptr.MEMBERS[NaN], 'undefined');
	assertEquals(typeof Ptr.MEMBERS[Infinity], 'undefined');

	class Test extends DummyPtr {}
	assertEquals(Test.MEMBERS[0], { byteOffset: 0, byteLength: 1 });
	assertEquals(Test.MEMBERS[1], { byteOffset: 1, byteLength: 1 });
	assertEquals(Test.MEMBERS[-1], { byteOffset: -1, byteLength: 1 });

	const value = { ...Test.MEMBERS[0] };
	(Test.MEMBERS as MemberInfos)['weird'] = value;
	assertThrows(() => {
		(Test.MEMBERS as MemberInfos)[0] = value;
	});
});

Deno.test('Ptr: buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new DummyPtr(buffer).buffer, buffer);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new DummyPtr(new Uint8Array() as ArrayBufferLike),
		TypeError,
	);
});

Deno.test('Ptr: byteOffset', () => {
	const MAX = Number.MAX_SAFE_INTEGER;

	const buffer = new ArrayBuffer(32);
	assertEquals(new DummyPtr(buffer, 4).byteOffset, 4);
	assertEquals(new DummyPtr(buffer, 3.14).byteOffset, 3);
	assertEquals(new DummyPtr(buffer, 3.99).byteOffset, 3);
	assertEquals(new DummyPtr(buffer, Number.EPSILON).byteOffset, 0);
	assertEquals(new DummyPtr(buffer, 1 - Number.EPSILON).byteOffset, 0);
	assertEquals(new DummyPtr(buffer, NaN).byteOffset, 0);
	assertEquals(new DummyPtr(buffer, MAX).byteOffset, MAX);
	assertEquals(new DummyPtr(buffer, 32).byteOffset, 32);
	assertEquals(new DummyPtr(buffer, -1).byteOffset, -1);

	// Impossible offset throws immediately.
	assertThrows(() => new DummyPtr(buffer, MAX + 1), RangeError);
	assertThrows(() => new DummyPtr(buffer, MAX + .5), RangeError);
	assertThrows(() => new DummyPtr(buffer, Infinity), RangeError);
	assertThrows(() => new DummyPtr(buffer, -Infinity), RangeError);

	// Offset over buffer size throws lazy.
	assertThrows(() => new Uint8Ptr(buffer, 32)[0], RangeError);
	assertThrows(() => new Uint8Ptr(buffer, 33)[0], RangeError);
});

Deno.test('Ptr: littleEndian', () => {
	const buffer = new ArrayBuffer(32);
	assertEquals(new DummyPtr(buffer).littleEndian, LITTLE_ENDIAN);
	assertEquals(new DummyPtr(buffer, 0, true).littleEndian, true);
	assertEquals(new DummyPtr(buffer, 0, false).littleEndian, false);
});

Deno.test('Ptr: getter + setter', () => {
	const test = new Ptr(new ArrayBuffer(4), 1);
	for (let i = -2; i <= 5; i++) {
		assertThrows(() => test[i], TypeError, `Read from void pointer: ${i}`);
		assertThrows(
			() => {
				(test as unknown as Uint8Ptr)[i] = 0;
			},
			TypeError,
			`Write to void pointer: ${i}`,
		);
	}
});

Deno.test('Ptr: [[get]]', () => {
	const test = new Uint8Ptr(new Uint8Array([1, 2, 3, 4]).buffer, 2);

	assertEquals(test[-2], 1);
	assertEquals(test[-1], 2);
	assertEquals(test[0], 3);
	assertEquals(test[1], 4);

	assertEquals(test['-0' as unknown as number], undefined);
	assertEquals(test['1e3' as unknown as number], undefined);
});

Deno.test('Ptr: [[set]]', () => {
	const data = new Uint8Array(4);
	const test = new Uint8Ptr(data.buffer, 2);
	test[-2] = 1;
	test[-1] = 2;
	test[0] = 3;
	test[1] = 4;

	assertEquals(test[-2], 1);
	assertEquals(test[-1], 2);
	assertEquals(test[0], 3);
	assertEquals(test[1], 4);

	assertEquals(data, new Uint8Array([1, 2, 3, 4]));

	const o = test as unknown as Record<PropertyKey, unknown>;
	const unk = 'unknown';
	o[unk] = 123;
	assertEquals(o[unk], 123);

	o[unk] = 'value';
	assertEquals(o[unk], 'value');
});

Deno.test('Ptr: [[has]]', () => {
	const data = new Uint8Array(4);
	const test = new Uint8Ptr(data.buffer, 2);

	assertEquals(0 in test, true);
	assertEquals(1 in test, true);
	assertEquals(10 in test, true);
	assertEquals((-1) in test, true);
	assertEquals((-10) in test, true);

	assertEquals('0' in test, true);
	assertEquals('1' in test, true);
	assertEquals('10' in test, true);
	assertEquals('-1' in test, true);
	assertEquals('-10' in test, true);

	const o = test as unknown as Record<PropertyKey, unknown>;
	const unk = 'unknown';
	o[unk] = 'value';
	assertEquals(unk in test, true);
});

Deno.test('Ptr: [[deleteProperty]]', () => {
	const data = new Uint8Array(4);
	const test = new Uint8Ptr(data.buffer, 2);

	assertThrows(() => delete test[0], TypeError);
	assertThrows(() => delete test[1], TypeError);
	assertThrows(() => delete test[10], TypeError);
	assertThrows(() => delete test[-1], TypeError);
	assertThrows(() => delete test[-10], TypeError);

	const o = test as unknown as Record<PropertyKey, unknown>;
	const unk = 'unknown';
	assertEquals(delete o[unk], true);
	assertEquals(unk in test, false);

	o[unk] = 'value';
	assertEquals(unk in test, true);
	assertEquals(delete o[unk], true);
	assertEquals(unk in test, false);
});

Deno.test('pointer', () => {
	class Foo extends Struct {
		declare public bar: number;

		declare public baz: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'bar', o);
			o += int8(this, 'baz', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const FooPtr = pointer(Foo);
	assertEquals(FooPtr.BYTES_PER_ELEMENT, Foo.BYTE_LENGTH);
	assertStrictEquals(pointer(Foo), FooPtr);

	const data = new Int8Array(Foo.BYTE_LENGTH * 3);
	const f = new FooPtr(data.buffer, Foo.BYTE_LENGTH);
	{
		f[-1].bar = -2;
		f[-1].baz = -1;
		assertStrictEquals(f[-1], f[-1]);
	}
	{
		f[0].bar = 1;
		f[0].baz = 2;
		assertStrictEquals(f[0], f[0]);
	}
	{
		const tmp = new Foo(new ArrayBuffer(Foo.BYTE_LENGTH));
		tmp.bar = 3;
		tmp.baz = 4;
		f[1] = tmp;
		assertNotStrictEquals(f[1], tmp);
	}
	assertEquals(data, new Int8Array([-2, -1, 1, 2, 3, 4]));
});
