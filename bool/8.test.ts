import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import { bool8, Bool8Ptr } from './8.ts';

Deno.test('bool8', () => {
	class Test extends Struct {
		declare public alpha: boolean;

		declare public beta: boolean;

		static {
			bool8(this, 'alpha');
			bool8(this, 'beta');
		}
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
	assertEquals(test.byteLength, Test.BYTE_LENGTH);
	for (const b of [true, false]) {
		test.alpha = b;
		test.beta = b;
		assertEquals(test.alpha, b);
		assertEquals(test.beta, b);
		assertEquals(data[off.alpha], b ? 1 : 0);
		assertEquals(data[off.beta], b ? 1 : 0);
	}

	for (let i = 0xff; i >= 0; i--) {
		data[off.alpha] = i;
		data[off.beta] = i;
		assertEquals(test.alpha, i !== 0);
		assertEquals(test.beta, i !== 0);
	}
});

Deno.test('Bool8Ptr', () => {
	const bpe = Bool8Ptr.BYTES_PER_ELEMENT;
	assertEquals(bpe, 1);

	const count = 3;
	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + bpe);
		const view = new DataView(buffer);
		const ptr = new Bool8Ptr(buffer, bpe, littleEndian);
		for (let i = -1; i < count; i++) {
			const o = bpe * i + bpe;
			ptr[i] = true;
			assertEquals(view.getInt8(o), 1);
			ptr[i] = false;
			assertEquals(view.getInt8(o), 0);
			view.setInt8(o, -1);
			assertEquals(ptr[i], true);
		}
	}

	assertEquals(
		`${new Bool8Ptr(new ArrayBuffer(0))}`,
		`[object ${Bool8Ptr.name}]`,
	);
});
