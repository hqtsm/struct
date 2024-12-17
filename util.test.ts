import { assertEquals, assertThrows } from '@std/assert';
import { uint8 } from './int/8.ts';
import { Struct } from './struct.ts';
import { assignType, assignView, constant } from './util.ts';

Deno.test('constant', () => {
	class A {
		public static readonly foo: string = 'bar';

		static {
			constant(this, 'foo');
		}
	}
	assertEquals(Object.getOwnPropertyDescriptor(A, 'foo'), {
		value: 'bar',
		writable: false,
		enumerable: false,
		configurable: false,
	});

	class B {
		public static readonly foo: string;

		static {
			constant(this, 'foo', 'bar');
		}
	}
	assertEquals(Object.getOwnPropertyDescriptor(B, 'foo'), {
		value: 'bar',
		writable: false,
		enumerable: false,
		configurable: false,
	});

	class C {
		declare public static readonly foo: string;

		static {
			constant(this, 'foo', 'bar');
		}
	}
	assertEquals(Object.getOwnPropertyDescriptor(C, 'foo'), {
		value: 'bar',
		writable: false,
		enumerable: false,
		configurable: false,
	});

	class D {
		public static foo: string = 'bar';

		static {
			// @ts-expect-error: Not readonly.
			constant(this, 'foo');
		}
	}
	assertEquals(Object.getOwnPropertyDescriptor(D, 'foo'), {
		value: 'bar',
		writable: false,
		enumerable: false,
		configurable: false,
	});
});

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

		static {
			uint8(this, 'alpha');
			uint8(this, 'beta');
		}
	}

	class TestExt extends Test {
		declare public gamma: number;

		static {
			uint8(this, 'gamma');
		}
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
