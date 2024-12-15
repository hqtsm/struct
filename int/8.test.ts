import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import { int8, Int8Ptr, uint8, Uint8Ptr } from './8.ts';

Deno.test('int8', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = int8(this, 'alpha', o);
			o = int8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 2);
	assertEquals(getByteLength(Test, 'alpha'), 1);
	assertEquals(getByteLength(Test, 'beta'), 1);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = -1;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, -1);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});

Deno.test('uint8', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = uint8(this, 'alpha', o);
			o = uint8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
	};

	assertEquals(Test.BYTE_LENGTH, 2);
	assertEquals(getByteLength(Test, 'alpha'), 1);
	assertEquals(getByteLength(Test, 'beta'), 1);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer);
	test.alpha = 0x7f;
	test.beta = 0xff;

	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	assertEquals(test.alpha, 0x7f);
	assertEquals(test.beta, 0xff);
	assertEquals(data[off.alpha], 0x7f);
	assertEquals(data[off.beta], 0xff);
});

Deno.test('Int8Ptr', () => {
	const bpe = Int8Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 1);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Int8Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1;
			assertEquals(view.getInt8(o), -1);
			view.setInt8(o, 1);
			assertEquals(ptr[i], 1);
		}
	}
});

Deno.test('Uint8Ptr', () => {
	const bpe = Uint8Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 1);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Uint8Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = -1;
			assertEquals(view.getUint8(o), 0xff);
			view.setUint8(o, 1);
			assertEquals(ptr[i], 1);
		}
	}
});
