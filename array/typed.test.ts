import { assertEquals } from '@std/assert';
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

Deno.test('properties', () => {
	class Test extends ArrayTyped<number> {
		protected override [ArrayTyped.getter](_index: number): number {
			return 0;
		}

		protected override [ArrayTyped.setter](
			_index: number,
			_value: number,
		): void {
		}
	}

	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		const sop = Object.getOwnPropertyNames(spec).length;
		const sos = Object.getOwnPropertySymbols(spec).length;
		spec[p as number] = 2;
		const sap = Object.getOwnPropertyNames(spec).length - sop;
		const sas = Object.getOwnPropertySymbols(spec).length - sos;

		const test = new Test(new ArrayBuffer(2), 0, 2);
		const top = Object.getOwnPropertyNames(test).length;
		const tos = Object.getOwnPropertySymbols(test).length;
		test[p as number] = 2;
		const tap = Object.getOwnPropertyNames(test).length - top;
		const tas = Object.getOwnPropertySymbols(test).length - tos;

		assertEquals(tap, sap, `[${String(p)}]: ${tap} != ${sap}`);
		assertEquals(tas, sas, `[${String(p)}]: ${tas} != ${sas}`);
	}
});

Deno.test('get', () => {
	class Test extends ArrayTyped<number> {
		protected override [ArrayTyped.getter](index: number): number {
			return index;
		}

		protected override [ArrayTyped.setter](
			index: number,
			value: number,
		): void {
			throw new Error(`Setter: ${index} = ${value}`);
		}
	}

	for (const p of properties) {
		const spec = new Uint8Array([0, 1]);
		const expected = spec[p as number];

		const test = new Test(new ArrayBuffer(2), 0, 2);
		assertEquals(
			test[p as number],
			expected,
			String(p),
		);
	}
});

Deno.test('set', () => {
	let called: [number, number] | null;

	class Test extends ArrayTyped<number> {
		protected override [ArrayTyped.getter](index: number): number {
			throw new Error(`Getter: ${index}`);
		}

		protected override [ArrayTyped.setter](
			index: number,
			value: number,
		): void {
			called = [index, value];
		}
	}

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

		const test = new Test(new ArrayBuffer(2), 0, 2);
		called = null as typeof called;
		test[p as number] = 2;
		assertEquals(called, expected, String(p));
	}
});
