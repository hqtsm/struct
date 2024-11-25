import { assertEquals, assertThrows } from '@std/assert';

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

class GetIndexSetDummy extends ArrayTyped<number> {
	protected override [ArrayTyped.getter](index: number): number {
		return index;
	}

	protected override [ArrayTyped.setter](): void {}
}

class GetIndexSetThrow extends ArrayTyped<number> {
	protected override [ArrayTyped.getter](index: number): number {
		return index;
	}

	protected override [ArrayTyped.setter](index: number, value: number): void {
		throw new Error(`Setter: ${index} = ${value}`);
	}
}

class GetThrowSetDummy extends ArrayTyped<number> {
	protected override [ArrayTyped.getter](index: number): number {
		throw new Error(`Getter: ${index}`);
	}

	protected override [ArrayTyped.setter](): void {}
}

class GetThrowSetThrow extends ArrayTyped<number> {
	protected override [ArrayTyped.getter](index: number): number {
		throw new Error(`Getter: ${index}`);
	}

	protected override [ArrayTyped.setter](index: number, value: number): void {
		throw new Error(`Setter: ${index} = ${value}`);
	}
}

class GetThrowSetLog extends ArrayTyped<number> {
	protected called: [number, number] | null = null;

	protected override [ArrayTyped.getter](index: number): number {
		throw new Error(`Getter: ${index}`);
	}

	protected override [ArrayTyped.setter](index: number, value: number): void {
		this.called = [index, value];
	}

	public readCalled(): [number, number] | null {
		const r = this.called;
		this.called = null;
		return r;
	}
}

class GetSet extends ArrayTyped<number> {
	private values: number[] = [];

	protected override [ArrayTyped.getter](index: number): number {
		return this.values[index];
	}

	protected override [ArrayTyped.setter](index: number, value: number): void {
		this.values[index] = value;
	}
}

Deno.test('ArrayTyped: [[get]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		const expected = spec[p as number];

		const test = new GetIndexSetThrow(new ArrayBuffer(2), 0, 2);
		assertEquals(test[p as number], expected, String(p));
	}
});

Deno.test('ArrayTyped: [[set]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		let expected: [number, number] | null = null;
		for (let i = 0; i < spec.length; i++) {
			if (spec[i] === 2) {
				expected = [i, 2];
				break;
			}
		}

		const test = new GetThrowSetLog(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		const called = test.readCalled();
		assertEquals(called, expected, String(p));
	}

	{
		const spec = new Uint8Array([0, 1]);
		assertThrows(() => {
			(spec as { length: number }).length = 1;
		}, TypeError);
	}

	{
		const test = new GetIndexSetDummy(new ArrayBuffer(2), 0, 2);
		assertThrows(() => {
			(test as { length: number }).length = 1;
		}, TypeError);
	}
});

Deno.test('ArrayTyped: [[has]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		const expected = (p as number) in spec;

		const test = new GetThrowSetThrow(new ArrayBuffer(2), 0, 2);
		const isIn = (p as number) in test;
		assertEquals(isIn, expected, String(p));
	}
});

Deno.test('ArrayTyped: [[ownKeys]]', () => {
	{
		const spec = new Uint8Array([0, 1]);
		const expected = Reflect.ownKeys(spec);

		const test = new GetThrowSetDummy(new ArrayBuffer(2), 0, 2);
		const ownKeys = Reflect.ownKeys(test);
		assertEquals(ownKeys.sort(sorter), expected.sort(sorter));
	}

	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		const expected = Reflect.ownKeys(spec);

		const test = new GetThrowSetDummy(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		const ownKeys = Reflect.ownKeys(test);
		assertEquals(ownKeys.sort(sorter), expected.sort(sorter), String(p));
	}
});

Deno.test('ArrayTyped: [[deleteProperty]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		let expErr: Error | null = null;
		try {
			delete spec[p as number];
		} catch (err) {
			expErr = err as Error;
		}
		const expIn = (p as number) in spec;

		const test = new GetIndexSetDummy(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		let actErr: Error | null = null;
		try {
			delete test[p as number];
		} catch (err) {
			actErr = err as Error;
		}
		const actIn = (p as number) in test;
		assertEquals(actErr?.constructor, expErr?.constructor, String(p));
		assertEquals(actIn, expIn, String(p));
	}
});

Deno.test('ArrayTyped: [[getOwnPropertyDescriptor]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		const expected = Object.getOwnPropertyDescriptor(spec, p as number);

		const test = new GetSet(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		const actual = Object.getOwnPropertyDescriptor(test, p as number);

		assertEquals(expected, actual, String(p));
	}
});

Deno.test('ArrayTyped: [[preventExtensions]]', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		Object.preventExtensions(spec);
		let specErr: Error | null = null;
		try {
			spec[p as number] = 2;
		} catch (err) {
			specErr = err as Error;
		}

		const test = new GetIndexSetDummy(new ArrayBuffer(2), 0, 2);
		Object.preventExtensions(test);
		let testErr: Error | null = null;
		try {
			test[p as number] = 2;
		} catch (err) {
			testErr = err as Error;
		}
		assertEquals(
			testErr?.constructor,
			specErr?.constructor,
			String(p),
		);
	}

	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		Object.preventExtensions(spec);
		const expected = Reflect.ownKeys(spec);

		const test = new GetThrowSetDummy(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		Object.preventExtensions(test);
		const ownKeys = Reflect.ownKeys(test);
		assertEquals(ownKeys.sort(sorter), expected.sort(sorter), String(p));
	}

	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		spec[p as number] = 2;
		Object.preventExtensions(spec);
		const expected = Object.getOwnPropertyDescriptor(spec, p as number);

		const test = new GetSet(new ArrayBuffer(2), 0, 2);
		test[p as number] = 2;
		Object.preventExtensions(test);
		const actual = Object.getOwnPropertyDescriptor(test, p as number);
		assertEquals(actual, expected, String(p));
	}
});

Deno.test('ArrayTyped: Dynamic properties', () => {
	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		const sop = Object.getOwnPropertyNames(spec).length;
		const sos = Object.getOwnPropertySymbols(spec).length;
		spec[p as number] = 2;
		const sap = Object.getOwnPropertyNames(spec).length - sop;
		const sas = Object.getOwnPropertySymbols(spec).length - sos;

		const test = new GetThrowSetDummy(new ArrayBuffer(2), 0, 2);
		const top = Object.getOwnPropertyNames(test).length;
		const tos = Object.getOwnPropertySymbols(test).length;
		test[p as number] = 2;
		const tap = Object.getOwnPropertyNames(test).length - top;
		const tas = Object.getOwnPropertySymbols(test).length - tos;

		assertEquals(tap, sap, `[${String(p)}]: ${tap} != ${sap}`);
		assertEquals(tas, sas, `[${String(p)}]: ${tas} != ${sas}`);
	}
});
