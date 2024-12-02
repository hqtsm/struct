import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { Uint8Ptr } from './int/8.ts';
import { Ptr } from './ptr.ts';

class DummyPtr extends Ptr<number> {
	protected override [Ptr.getter](index: number): number {
		throw new Error(`Getter: [${index}]`);
	}

	protected override [Ptr.setter](index: number, value: number): void {
		throw new Error(`Setter: [${index}] = ${String(value)}`);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}

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

	// Negative and impossible offset throws immediately.
	assertThrows(() => new DummyPtr(buffer, -1), RangeError);
	assertThrows(() => new DummyPtr(buffer, MAX + 1), RangeError);
	assertThrows(() => new DummyPtr(buffer, MAX + .5), RangeError);
	assertThrows(() => new DummyPtr(buffer, Infinity), RangeError);

	// Offset over buffer size throws lazy.
	assertThrows(() => new Uint8Ptr(buffer, 32)[0], RangeError);
	assertThrows(() => new Uint8Ptr(buffer, 33)[0], RangeError);
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