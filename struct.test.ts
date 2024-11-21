import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { Struct } from './struct.ts';
import { LITTLE_ENDIAN } from './const.ts';
import { int8 } from './member/i8.ts';

Deno.test('buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Struct(buffer).buffer, buffer);
});

Deno.test('byteLength', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new Uint8Array(16);
	assertEquals(new Test(data.buffer, 4).byteLength, 8);
});

Deno.test('byteOffset', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new ArrayBuffer(32);
	assertEquals(new Test(data, 4).byteOffset, 4);
	assertEquals(new Test(data, 3.14).byteOffset, 3);
	assertEquals(new Test(data, 3.99).byteOffset, 3);
	assertEquals(new Test(data, 32).byteOffset, 32);
	assertThrows(() => new Test(data, -1), RangeError);
	assertThrows(() => new Test(data, 33), RangeError);
});

Deno.test('dataView', () => {
	const data = new ArrayBuffer(32);
	{
		const test = new Struct(data);
		assertStrictEquals(test.dataView, test.dataView);
	}
	assertEquals(new Struct(data, 16).dataView.byteOffset, 16);
	assertEquals(new Struct(data, 16).dataView.byteLength, 16);
	assertEquals(new Struct(data, 4).dataView.byteOffset, 4);
	assertEquals(new Struct(data, 4).dataView.byteLength, 28);
	assertEquals(new Struct(data, 3.14).dataView.byteOffset, 3);
	assertEquals(new Struct(data, 3.14).dataView.byteLength, 29);
	assertEquals(new Struct(data, 32).dataView.byteOffset, 32);
	assertEquals(new Struct(data, 32).dataView.byteLength, 0);
	{
		const test = new Struct(data, 16);
		test.dataView.setUint8(0, 42);
		assertEquals(new Uint8Array(data)[16], 42);
	}
});

Deno.test('littleEndian', () => {
	const data = new ArrayBuffer(32);
	assertEquals(new Struct(data).littleEndian, LITTLE_ENDIAN);
	assertEquals(new Struct(data, 0, true).littleEndian, true);
	assertEquals(new Struct(data, 0, false).littleEndian, false);
});

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Struct.BYTE_LENGTH, 0);
});

Deno.test('protected properties', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare protected alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('private properties', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare private alpha: number;

		declare public unrelated: number;

		public getAlpha(): number {
			return this.alpha;
		}

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const test = new Test(new Uint8Array([42]).buffer);
	assertEquals(test.getAlpha(), 42);
});

Deno.test('extends', () => {
	class Type extends Struct {
		declare public readonly ['constructor']: typeof Type;

		declare public type: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'type', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class Type8 extends Type {
		declare public readonly ['constructor']: typeof Type8;

		declare public value: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Type8.BYTE_LENGTH);
	const varFloat = new Type8(data.buffer, 0, true);
	varFloat.type = 8;
	varFloat.value = 123;
	assertEquals(data, new Uint8Array([8, 123]));
});
