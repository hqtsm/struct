import { assertEquals } from '@std/assert';
import { Struct } from '../struct.ts';
import { getByteLength, getByteOffset } from '../util.ts';
import {
	int16,
	int16BE,
	Int16BEPtr,
	int16LE,
	Int16LEPtr,
	Int16Ptr,
	uint16,
	uint16BE,
	Uint16BEPtr,
	uint16LE,
	Uint16LEPtr,
	Uint16Ptr,
} from './16.ts';

Deno.test('int16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		static {
			int16(this, 'alpha');
			int16(this, 'beta');
			int16LE(this, 'gamma');
			int16BE(this, 'delta');
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 8);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 2);
	assertEquals(getByteLength(Test, 'gamma'), 2);
	assertEquals(getByteLength(Test, 'delta'), 2);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt16(off.alpha, false), 0x7fff);
		assertEquals(view.getInt16(off.beta, false), -2);
		assertEquals(view.getInt16(off.gamma, true), -3);
		assertEquals(view.getInt16(off.delta, false), -4);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = -2;
		test.gamma = -3;
		test.delta = -4;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, -2);
		assertEquals(test.gamma, -3);
		assertEquals(test.delta, -4);
		assertEquals(view.getInt16(off.alpha, true), 0x7fff);
		assertEquals(view.getInt16(off.beta, true), -2);
		assertEquals(view.getInt16(off.gamma, true), -3);
		assertEquals(view.getInt16(off.delta, false), -4);
	}
});

Deno.test('uint16', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		declare public gamma: number;

		declare public delta: number;

		static {
			uint16(this, 'alpha');
			uint16(this, 'beta');
			uint16LE(this, 'gamma');
			uint16BE(this, 'delta');
		}
	}

	const off = {
		alpha: getByteOffset(Test, 'alpha'),
		beta: getByteOffset(Test, 'beta'),
		gamma: getByteOffset(Test, 'gamma'),
		delta: getByteOffset(Test, 'delta'),
	};

	assertEquals(Test.BYTE_LENGTH, 8);
	assertEquals(getByteLength(Test, 'alpha'), 2);
	assertEquals(getByteLength(Test, 'beta'), 2);
	assertEquals(getByteLength(Test, 'gamma'), 2);
	assertEquals(getByteLength(Test, 'delta'), 2);

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const view = new DataView(data.buffer);
	{
		const test = new Test(data.buffer, 0, false);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xfffe);
		assertEquals(test.gamma, 0xfffd);
		assertEquals(test.delta, 0xfffc);
		assertEquals(view.getUint16(off.alpha, false), 0x7fff);
		assertEquals(view.getUint16(off.beta, false), 0xfffe);
		assertEquals(view.getUint16(off.gamma, true), 0xfffd);
		assertEquals(view.getUint16(off.delta, false), 0xfffc);
	}
	{
		const test = new Test(data.buffer, 0, true);
		test.alpha = 0x7fff;
		test.beta = 0xfffe;
		test.gamma = 0xfffd;
		test.delta = 0xfffc;

		assertEquals(test.byteLength, Test.BYTE_LENGTH);
		assertEquals(test.alpha, 0x7fff);
		assertEquals(test.beta, 0xfffe);
		assertEquals(test.gamma, 0xfffd);
		assertEquals(test.delta, 0xfffc);
		assertEquals(view.getUint16(off.alpha, true), 0x7fff);
		assertEquals(view.getUint16(off.beta, true), 0xfffe);
		assertEquals(view.getUint16(off.gamma, true), 0xfffd);
		assertEquals(view.getUint16(off.delta, false), 0xfffc);
	}
});

Deno.test('Int16Ptr', () => {
	for (
		const [Ptr, le] of [
			[Int16Ptr, null],
			[Int16BEPtr, false],
			[Int16LEPtr, true],
		] as [typeof Int16Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 2);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(view.getInt16(o, le ?? ptr.littleEndian), -1);
				view.setInt16(o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}

		assertEquals(
			`${new Ptr(new ArrayBuffer(0))}`,
			`[object ${Ptr.name}]`,
		);
	}
});

Deno.test('Uint16Ptr', () => {
	for (
		const [Ptr, le] of [
			[Uint16Ptr, null],
			[Uint16BEPtr, false],
			[Uint16LEPtr, true],
		] as [typeof Uint16Ptr, boolean | null][]
	) {
		const bpe = Ptr.BYTES_PER_ELEMENT;
		assertEquals(bpe, 2);

		const count = 3;
		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + bpe);
			const view = new DataView(buffer);
			const ptr = new Ptr(buffer, bpe, littleEndian);
			for (let i = -1; i < count; i++) {
				const o = bpe * i + bpe;
				ptr[i] = -1;
				assertEquals(view.getUint16(o, le ?? ptr.littleEndian), 0xffff);
				view.setUint16(o, 1, le ?? ptr.littleEndian);
				assertEquals(ptr[i], 1);
			}
		}

		assertEquals(
			`${new Ptr(new ArrayBuffer(0))}`,
			`[object ${Ptr.name}]`,
		);
	}
});
