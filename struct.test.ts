import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { Struct } from './struct.ts';
import { LITTLE_ENDIAN } from './endian.ts';
import { int8 } from './int/8.ts';
import { member, pad } from './member.ts';
import { getByteOffset } from './util.ts';

Deno.test('buffer', () => {
	const buffer = new ArrayBuffer(0);
	assertStrictEquals(new Struct(buffer).buffer, buffer);
});

Deno.test('byteLength', () => {
	class Test extends Struct {
		public static override readonly BYTE_LENGTH: number = 8;
	}

	const data = new Uint8Array(16);
	assertEquals(new Test(data.buffer, 4).byteLength, 8);
});

Deno.test('byteOffset', () => {
	class Test extends Struct {
		declare public alpha: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'alpha', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new ArrayBuffer(32);
	assertEquals(new Test(data, 4).byteOffset, 4);
	assertEquals(new Test(data, 3.14).byteOffset, 3);
	assertEquals(new Test(data, 3.99).byteOffset, 3);
	assertEquals(new Test(data, 32).byteOffset, 32);

	// Negative offset throws immediately.
	assertThrows(() => new Test(data, -1), RangeError);

	// Offset over buffer size throws lazy.
	const over = new Test(data, 33);
	assertThrows(() => over.alpha, RangeError);

	// Non-ArrayBuffer throws immediately.
	assertThrows(
		() => new Test(new Uint8Array() as ArrayBufferLike),
		TypeError,
	);
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
	class Var extends Struct {
		declare public type: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'type', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class Int8 extends Var {
		declare public value: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Int8.BYTE_LENGTH);
	const varFloat = new Int8(data.buffer, 0, true);
	varFloat.type = 8;
	varFloat.value = 123;
	assertEquals(data, new Uint8Array([8, 123]));
});

Deno.test('abstract', () => {
	abstract class Member extends Struct {
		declare public value: number;

		public abstract method(): number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	class Test extends Struct {
		declare public child: MemberImp;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += member(MemberImp, this, 'child', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new Test(data.buffer, 0, true);
	test.child.value = 123;
	assertEquals(data, new Uint8Array([123]));
});

Deno.test('abstract placeholder', () => {
	abstract class Member extends Struct {
		declare public value: number;

		public abstract method(): number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += int8(this, 'value', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class MemberImp extends Member {
		declare public value: number;

		public method(): number {
			return 42;
		}
	}

	abstract class Test extends Struct {
		declare public child: Member;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += pad(Member.BYTE_LENGTH, this, 'child' as never, o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class TestImp extends Test {
		declare public child: Member;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += member(MemberImp, this, 'child', getByteOffset(this, 'child'));
			return o;
		})(super.BYTE_LENGTH);
	}

	const data = new Uint8Array(Test.BYTE_LENGTH);
	const test = new TestImp(data.buffer, 0, true);
	test.child.value = 123;
	assertEquals(data, new Uint8Array([123]));
});
