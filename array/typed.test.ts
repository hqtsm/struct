import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { LITTLE_ENDIAN } from '../endian.ts';

import { ArrayTyped } from './typed.ts';

// Properties to ensure matching TypedArray behavior.
// Use real TypedArray to detect the expected bahavior.
// Some properties:
// - Map to an index (uint in range 0 to length-1).
// - Get discarded (numeric non-uint and out-of-range).
// - Map to a regular property/symbol (everything else).
const properties = [
	...new Set([
		...[
			0,
			0.5,
			1,
			1.5,
			2,
			100,
			Math.PI,
			Number.EPSILON,
			Infinity,
			NaN,
			Number.MAX_SAFE_INTEGER,
			Number.MAX_VALUE,
			Number.MIN_VALUE,
			0n,
			1n,
			0xffffffffffffffffn,
			'.1',
			'.5',
			'.9',
			'0n',
			'1n',
			'0xffffffffffffffffn',
			'',
			'0x0',
			'0x1',
			'0b0',
			'0b1',
			[
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				[10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
				[20, 21],
			].flat().map((i) => `1e${i}`),
			'0.0000000000000001',
			'0.0000000000000009',
			'0.9999999999999999',
			'1.0000000000000001',
			'1.0000000000000009',
			'1.9999999999999999',
			'unknown',
		].map((n) => [n, -n, `${n}`, `-${n}`, `+${n}`]).flat(),
		...new Set(
			[
				true,
				false,
				null,
				undefined,
			].map((n) => [n, `${n}`, `-${n}`, `+${n}`]).flat(),
		),
		Symbol('symbol'),
		{},
		[],
	]),
];

function filterArrayKeys(
	length: number,
	out = false,
): (k: PropertyKey) => boolean {
	const keys = new Set<PropertyKey>();
	for (let i = 0; i < length; i++) {
		keys.add(String(i));
	}
	return (k: PropertyKey) => keys.has(k) !== out;
}

function sorter(a: string | symbol, b: string | symbol): number {
	const aT = typeof a;
	const bT = typeof b;
	if (aT === 'string' && bT === 'symbol') {
		return -1;
	}
	if (bT === 'string' && aT === 'symbol') {
		return 1;
	}
	const aS = String(a);
	const bS = String(b);
	if (aS < bS) {
		return -1;
	}
	if (aS > bS) {
		return 1;
	}
	return 0;
}

class DummyArray extends ArrayTyped<number> {
	protected override [ArrayTyped.getter](index: number): number {
		throw new Error(`Getter: [${index}]`);
	}

	protected override [ArrayTyped.setter](
		index: number,
		value: unknown,
	): void {
		throw new Error(`Setter: [${index}] = ${String(value)}`);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 1;
}

class TestArray extends ArrayTyped<number> {
	#values: number[] = [];

	#lastGetter: number | null = null;

	#lastSetter: [number, unknown] | null = null;

	constructor(values: number[]) {
		super(new ArrayBuffer(values.length), 0, values.length);
		this.#values = values.map((i) => i | 0);
	}

	protected override [ArrayTyped.getter](index: number): number {
		this.#lastGetter = index;
		return this.#values[index];
	}

	protected override [ArrayTyped.setter](
		index: number,
		value: unknown,
	): void {
		this.#lastSetter = [index, value];
		this.#values[index] = Number(value) | 0;
	}

	public lastGetter(): number | null {
		const r = this.#lastGetter;
		this.#lastGetter = null;
		return r;
	}

	public lastSetter(): [number, unknown] | null {
		const r = this.#lastSetter;
		this.#lastSetter = null;
		return r;
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;
}

Deno.test('buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new DummyArray(buffer).buffer, buffer);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new DummyArray(new Uint8Array() as ArrayBufferLike),
		TypeError,
	);
});

Deno.test('length + byteLength', () => {
	const buffer = new ArrayBuffer(0);
	assertEquals(new DummyArray(buffer).byteLength, 0);
	assertEquals(new DummyArray(buffer, 1).byteLength, 0);
	assertEquals(new DummyArray(buffer, 0, 1).byteLength, 1);
	assertEquals(new DummyArray(buffer, 0, 2).byteLength, 2);
	assertEquals(new TestArray([]).byteLength, 0);
	assertEquals(new TestArray([1]).byteLength, 4);
	assertEquals(new TestArray([1, 2]).byteLength, 8);

	// Negative length throws immediately.
	assertThrows(() => new DummyArray(buffer, 0, -1), RangeError);
});

Deno.test('byteOffset', () => {
	const data = new ArrayBuffer(32);

	// Negative offset throws immediately.
	assertThrows(() => new DummyArray(data, -1), RangeError);

	// Offset over buffer size does not throw unless later accessed.
	assertEquals(new DummyArray(data, 32).byteOffset, 32);
	assertEquals(new DummyArray(data, 33).byteOffset, 33);
});

Deno.test('littleEndian', () => {
	const data = new ArrayBuffer(32);
	assertEquals(new DummyArray(data).littleEndian, LITTLE_ENDIAN);
	assertEquals(new DummyArray(data, 0, 0, true).littleEndian, true);
	assertEquals(new DummyArray(data, 0, 0, false).littleEndian, false);
});

Deno.test('ArrayTyped: [[get]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		const expected = spec[p];

		const test = new TestArray([0, 1]);

		assertEquals(test[p], expected, String(p));
	}
});

Deno.test('ArrayTyped: [[set]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		let expected: [number, number] | null = null;
		for (let i = 0; i < spec.length; i++) {
			if (spec[i] === 2) {
				expected = [i, 2];
				break;
			}
		}

		const test = new TestArray([0, 1]);
		test[p] = 2;
		const called = test.lastSetter();

		assertEquals(called, expected, String(p));
	}

	{
		const spec = new Uint8Array([0, 1]);

		assertThrows(() => {
			(spec as { length: number }).length = 1;
		}, TypeError);
	}

	{
		const test = new TestArray([0, 1]);

		assertThrows(() => {
			(test as { length: number }).length = 1;
		}, TypeError);
	}
});

Deno.test('ArrayTyped: [[has]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		const expected = p in spec;

		const test = new TestArray([0, 1]);
		const isIn = p in test;

		assertEquals(isIn, expected, String(p));
		assertEquals(test.lastGetter(), null, String(p));
	}
});

Deno.test('ArrayTyped: [[deleteProperty]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		let expErr: Error | null = null;
		try {
			delete spec[p];
		} catch (err) {
			expErr = err as Error;
		}
		const expIn = p in spec;

		const test = new TestArray([0, 1]);
		test[p] = 2;
		let actErr: Error | null = null;
		try {
			delete test[p];
		} catch (err) {
			actErr = err as Error;
		}
		const actIn = p in test;

		assertEquals(actErr?.constructor, expErr?.constructor, String(p));
		assertEquals(actIn, expIn, String(p));
	}
});

Deno.test('ArrayTyped: [[ownKeys]]', () => {
	{
		const test = new TestArray([0, 1]);
		const ownKeys = Reflect.ownKeys(test);

		assertEquals(ownKeys, []);
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		const expected = Reflect.ownKeys(spec).filter(filterArrayKeys(2, true));

		const test = new TestArray([0, 1]);
		test[p] = 2;
		const ownKeys = Reflect.ownKeys(test);

		assertEquals(ownKeys, expected, String(p));
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		const sop = Object.getOwnPropertyNames(spec).length;
		const sos = Object.getOwnPropertySymbols(spec).length;
		spec[p] = 2;
		const sap = Object.getOwnPropertyNames(spec).length - sop;
		const sas = Object.getOwnPropertySymbols(spec).length - sos;

		const test = new TestArray([0, 1]);
		const top = Object.getOwnPropertyNames(test).length;
		const tos = Object.getOwnPropertySymbols(test).length;
		test[p] = 2;
		const tap = Object.getOwnPropertyNames(test).length - top;
		const tas = Object.getOwnPropertySymbols(test).length - tos;

		assertEquals(tap, sap, `[${String(p)}]: ${tap} != ${sap}`);
		assertEquals(tas, sas, `[${String(p)}]: ${tas} != ${sas}`);
	}
});

Deno.test('ArrayTyped: [[getOwnPropertyDescriptor]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		const before = Reflect.ownKeys(spec).length;
		spec[p] = 2;
		const add = Reflect.ownKeys(spec).length - before;
		const expected = add
			? {
				value: 2,
				writable: true,
				enumerable: true,
				configurable: true,
			}
			: undefined;

		const test = new TestArray([0, 1]);
		test[p] = 2;
		const actual = Object.getOwnPropertyDescriptor(test, p);

		assertEquals(actual, expected, String(p));
	}
});

Deno.test('ArrayTyped: [[defineProperty]]', () => {
	for (
		const desc of [
			{
				value: 2,
			},
			{
				get(): number {
					return 2;
				},
			},
			{
				set(): void {},
			},
			{
				value: 2,
				writable: true,
				enumerable: true,
				configurable: true,
			},
		]
	) {
		for (const p of properties as number[]) {
			const tag = `${String(p)}: ${JSON.stringify(desc)}`;
			const spec = new Uint8Array([0, 1]);
			const before = Reflect.ownKeys(spec).length;
			try {
				Object.defineProperty(spec, p, desc);
			} catch (_) {
				// Ignore.
			}
			if (!(Reflect.ownKeys(spec).length - before)) {
				continue;
			}

			const test = new TestArray([0, 1]);
			Object.defineProperty(test, p, desc);
			assertEquals(p in test, p in spec, tag);

			const specDesc = Object.getOwnPropertyDescriptor(spec, p);
			const testDesc = Object.getOwnPropertyDescriptor(test, p);
			assertEquals(specDesc?.get, testDesc?.get, tag);
			assertEquals(specDesc?.set, testDesc?.set, tag);
			assertEquals(specDesc?.value, testDesc?.value, tag);
			assertEquals(specDesc?.writable, testDesc?.writable, tag);
			assertEquals(specDesc?.enumerable, testDesc?.enumerable, tag);
			assertEquals(specDesc?.configurable, testDesc?.configurable, tag);

			if (desc.writable) {
				spec[p] = 3;
				test[p] = 3;
				assertEquals(test[p], spec[p], tag);
			}

			assertEquals(
				Object.keys(spec).includes(p as unknown as string),
				Object.keys(test).includes(p as unknown as string),
				tag,
			);

			let expErr: Error | null = null;
			try {
				Object.defineProperty(spec, p, { value: 3 });
			} catch (err) {
				expErr = err as Error;
			}
			let actErr: Error | null = null;
			try {
				Object.defineProperty(test, p, { value: 3 });
			} catch (err) {
				actErr = err as Error;
			}

			assertEquals(actErr?.constructor, expErr?.constructor, tag);
			assertEquals(test[p], spec[p], tag);

			expErr = null;
			try {
				delete spec[p];
			} catch (err) {
				expErr = err as Error;
			}
			actErr = null;
			try {
				delete test[p];
			} catch (err) {
				actErr = err as Error;
			}

			assertEquals(actErr?.constructor, expErr?.constructor, tag);
			assertEquals(p in spec, p in test, tag);
		}
	}
});

Deno.test('ArrayTyped: [[isExtensible]] [[preventExtensions]]', () => {
	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		Object.preventExtensions(spec);
		let specErr: Error | null = null;
		try {
			spec[p] = 2;
		} catch (err) {
			specErr = err as Error;
		}

		const test = new TestArray([0, 1]);
		Object.preventExtensions(test);
		let testErr: Error | null = null;
		try {
			test[p] = 2;
		} catch (err) {
			testErr = err as Error;
		}

		assertEquals(
			testErr?.constructor,
			specErr?.constructor,
			String(p),
		);
		assertEquals(
			Object.isExtensible(test),
			Object.isExtensible(spec),
			String(p),
		);
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		Object.preventExtensions(spec);
		let expErr: Error | null = null;
		try {
			delete spec[p];
		} catch (err) {
			expErr = err as Error;
		}
		const expIn = p in spec;

		const test = new TestArray([0, 1]);
		test[p] = 2;
		Object.preventExtensions(test);
		let actErr: Error | null = null;
		try {
			delete test[p];
		} catch (err) {
			actErr = err as Error;
		}
		const actIn = p in test;

		assertEquals(actErr?.constructor, expErr?.constructor, String(p));
		assertEquals(actIn, expIn, String(p));
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		Object.preventExtensions(spec);
		const expected = Reflect.ownKeys(spec).filter(filterArrayKeys(2, true));

		const test = new TestArray([0, 1]);
		test[p] = 2;
		Object.preventExtensions(test);
		const ownKeys = Reflect.ownKeys(test);

		assertEquals(ownKeys.sort(sorter), expected.sort(sorter), String(p));
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		Object.preventExtensions(spec);
		let expErr: Error | null = null;
		try {
			Object.defineProperty(spec, p, { value: 2 });
		} catch (err) {
			expErr = err as Error;
		}
		const expIn = p in spec;

		const test = new TestArray([0, 1]);
		Object.preventExtensions(test);
		let actErr: Error | null = null;
		try {
			Object.defineProperty(spec, p, { value: 2 });
		} catch (err) {
			actErr = err as Error;
		}
		const actIn = p in test;

		assertEquals(actErr?.constructor, expErr?.constructor, String(p));
		assertEquals(actIn, expIn, String(p));
	}

	for (const p of properties as number[]) {
		const spec = new Uint8Array([0, 1]);
		spec[p] = 2;
		Object.preventExtensions(spec);
		let expErr: Error | null = null;
		try {
			Object.defineProperty(spec, p, { value: 3 });
		} catch (err) {
			expErr = err as Error;
		}
		const expIn = p in spec;

		const test = new TestArray([0, 1]);
		test[p] = 2;
		Object.preventExtensions(test);
		let actErr: Error | null = null;
		try {
			Object.defineProperty(spec, p, { value: 3 });
		} catch (err) {
			actErr = err as Error;
		}
		const actIn = p in test;

		assertEquals(actErr?.constructor, expErr?.constructor, String(p));
		assertEquals(actIn, expIn, String(p));
	}
});
