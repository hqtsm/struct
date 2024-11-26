import { assertEquals, assertThrows } from '@std/assert';

import { uint8 } from './int/8.ts';
import { Struct } from './struct.ts';
import { assignType, assignView } from './util.ts';

Deno.test('assignView', () => {
	const src = new Uint8Array([0xff, 0xfe, 0xfd, 0xfc]);
	const dst = new Int8Array(src.length);
	assignView(dst.subarray(1, 3), src.subarray(2, 4));
	assertEquals(dst, new Int8Array([0, -3, -4, 0]));
	assertThrows(() => assignView(dst, src.slice(1)), RangeError);
});

Deno.test('assignStruct', () => {
	class Test extends Struct {
		declare public alpha: number;

		declare public beta: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint8(this, 'alpha', o);
			o += uint8(this, 'beta', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestExt extends Test {
		declare public gamma: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += uint8(this, 'gamma', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	{
		const src = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 1), 1);
		src.alpha = 65;
		src.beta = 66;
		const dst = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 2), 2);
		assignType(dst, src);
		assertEquals(dst.alpha, 65);
		assertEquals(dst.beta, 66);
	}

	{
		const src = new TestExt(new ArrayBuffer(TestExt.BYTE_LENGTH + 1), 1);
		src.alpha = 65;
		src.beta = 66;
		src.gamma = 71;
		const dst = new Test(new ArrayBuffer(Test.BYTE_LENGTH + 2), 2);
		assignType(dst, src);
		assertEquals(dst.alpha, 65);
		assertEquals(dst.beta, 66);
	}
});
