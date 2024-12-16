import { getFloat16, setFloat16 } from '@hqtsm/dataview/float/16';
import { assertEquals } from '@std/assert';
import type { ArrayBufferReal } from '../native.ts';
import { Struct } from '../struct.ts';
import { dataView, getByteLength, getByteOffset } from '../util.ts';
import {
	float16,
	float16BE,
	Float16BEPtr,
	float16LE,
	Float16LEPtr,
	Float16Ptr,
} from './16.ts';

function round(n: number): number {
	const dataView = new DataView(new ArrayBuffer(2));
	setFloat16(dataView, 0, n);
	return getFloat16(dataView, 0);
}

Deno.test('float16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		static {
			float16LE(this, 'alpha');
			float16BE(this, 'beta');
			float16(this, 'gamma');
		}
	}

	class TestM extends Test {
		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
			Object.defineProperty(dataView(this.buffer), 'getFloat16', {
				value: function (
					this: DataView,
					offset: number,
					littleEndian?: boolean,
				): number {
					return getFloat16(this, offset, littleEndian);
				},
				configurable: true,
				writable: true,
			});
			Object.defineProperty(dataView(this.buffer), 'setFloat16', {
				value: function (
					this: DataView,
					offset: number,
					value: number,
					littleEndian?: boolean,
				): void {
					setFloat16(this, offset, value, littleEndian);
				},
				configurable: true,
				writable: true,
			});
		}
	}

	class TestF extends Test {
		constructor(
			buffer: ArrayBufferReal,
			byteOffset = 0,
			littleEndian: boolean | null = null,
		) {
			super(buffer, byteOffset, littleEndian);
			Object.defineProperty(dataView(this.buffer), 'getFloat16', {
				value: null,
				configurable: true,
				writable: true,
			});
			Object.defineProperty(dataView(this.buffer), 'setFloat16', {
				value: null,
				configurable: true,
				writable: true,
			});
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
	};

	assertEquals(Test.BYTE_LENGTH, 6);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 2);
	assertEquals(getByteLength(Test, 'gamma'), 2);

	const v = new DataView(new ArrayBuffer(4));
	for (
		const f64 of [
			0,
			1,
			-1,
			Math.PI,
			-Math.PI,
			Math.E,
			-Math.E,
			Number.EPSILON,
			-Number.EPSILON,
			Number.MAX_SAFE_INTEGER,
			Number.MIN_SAFE_INTEGER,
			Number.MAX_VALUE,
			Number.MIN_VALUE,
			Infinity,
			-Infinity,
			NaN,
		]
	) {
		setFloat16(v, 0, f64, true);
		const f16 = getFloat16(v, 0, true);

		const data = new Uint8Array(Test.BYTE_LENGTH);
		const view = new DataView(data.buffer);
		for (const Test of [TestM, TestF]) {
			const test = new Test(data.buffer, 0, false);
			test.alpha = f16;
			test.beta = f16;
			test.gamma = f16;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f16);
			assertEquals(test.beta, f16);
			assertEquals(test.gamma, f16);
			assertEquals(getFloat16(view, off.alpha, true), f16);
			assertEquals(getFloat16(view, off.beta, false), f16);
			assertEquals(getFloat16(view, off.gamma, false), f16);
		}
		for (const Test of [TestM, TestF]) {
			const test = new Test(data.buffer, 0, true);
			test.alpha = f16;
			test.beta = f16;
			test.gamma = f16;

			assertEquals(test.byteLength, Test.BYTE_LENGTH);
			assertEquals(test.alpha, f16);
			assertEquals(test.beta, f16);
			assertEquals(test.gamma, f16);
			assertEquals(getFloat16(view, off.alpha, true), f16);
			assertEquals(getFloat16(view, off.beta, false), f16);
			assertEquals(getFloat16(view, off.gamma, true), f16);
		}
	}
});

Deno.test('Float16Ptr', () => {
	for (
		const [Ptr, le] of [
			[Float16Ptr, null],
			[Float16BEPtr, false],
			[Float16LEPtr, true],
		] as [typeof Float16Ptr, boolean | null][]
	) {
		const { name } = Ptr;
		class PtrM extends Ptr {
			constructor(
				buffer: ArrayBufferReal,
				byteOffset = 0,
				littleEndian: boolean | null = null,
			) {
				super(buffer, byteOffset, littleEndian);
				Object.defineProperty(dataView(this.buffer), 'getFloat16', {
					value: function (
						this: DataView,
						offset: number,
						littleEndian?: boolean,
					): number {
						return getFloat16(this, offset, littleEndian);
					},
					configurable: true,
					writable: true,
				});
				Object.defineProperty(dataView(this.buffer), 'setFloat16', {
					value: function (
						this: DataView,
						offset: number,
						value: number,
						littleEndian?: boolean,
					): void {
						setFloat16(this, offset, value, littleEndian);
					},
					configurable: true,
					writable: true,
				});
			}
		}

		class PtrF extends Ptr {
			constructor(
				buffer: ArrayBufferReal,
				byteOffset = 0,
				littleEndian: boolean | null = null,
			) {
				super(buffer, byteOffset, littleEndian);
				Object.defineProperty(dataView(this.buffer), 'getFloat16', {
					value: null,
					configurable: true,
					writable: true,
				});
				Object.defineProperty(dataView(this.buffer), 'setFloat16', {
					value: null,
					configurable: true,
					writable: true,
				});
			}
		}

		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 2);

		const fA = round(Math.PI);
		const fB = round(-Math.E);

		const count = 3;
		for (const Ptr of [PtrM, PtrF]) {
			for (const littleEndian of [undefined, true, false]) {
				const buffer = new ArrayBuffer(bpe * count + bpe);
				const view = new DataView(buffer);
				const ptr = new Ptr(buffer, bpe, littleEndian);
				for (let i = -1; i < count; i++) {
					const o = bpe * i + bpe;
					ptr[i] = fA;
					assertEquals(
						getFloat16(view, o, le ?? ptr.littleEndian),
						fA,
					);
					setFloat16(view, o, fB, le ?? ptr.littleEndian);
					assertEquals(ptr[i], fB);
				}
			}

			assertEquals(
				`${new Ptr(new ArrayBuffer(0))}`,
				`[object ${name}]`,
			);
		}
	}
});
