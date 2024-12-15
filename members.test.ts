import { assertEquals } from '@std/assert/equals';

import { uint32 } from './int/32.ts';
import { member } from './member.ts';
import { Struct } from './struct.ts';
import { array } from './arr.ts';
import { Uint8Ptr } from './int/8.ts';

Deno.test('ClassMemberable: additional member', () => {
	class Foo extends Struct {
		declare public bar: number;

		declare public baz: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = uint32(this, 'bar', o);
			o = uint32(this, 'baz', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'byteLength', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'byteOffset', o);

			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Foo.BYTE_LENGTH, 16);
});

Deno.test('ClassMemberable: extends member', () => {
	class Child extends Struct {
		declare public one: number;

		declare public two: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = uint32(this, 'one', o);
			o = uint32(this, 'two', o);
			return o;
		})(super.BYTE_LENGTH);
	}

	class Parent extends Struct {
		declare public get: Child;

		declare public set: Child;

		declare public length: number;

		declare public gamma: Child;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			// Not an array, so we can use these.
			o = member(Child, this, 'get', o);
			o = member(Child, this, 'set', o);
			o = uint32(this, 'length', o);

			// @ts-expect-error: Does not exist in membered type.
			o = uint32(this, 'unknown', o);

			// @ts-expect-error: Does not extend the member type.
			o = member(Struct, this, 'gamma', o);

			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(Parent.BYTE_LENGTH, 24);
});

Deno.test('ClassMemberable: array properties', () => {
	const B4 = array(Uint8Ptr, 4);

	class B4Extra extends B4 {
		declare public extra: number;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o = uint32(this, 'extra', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'byteLength', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'byteOffset', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'length', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'get', o);

			// @ts-expect-error: A non-member built-in property.
			o = uint32(this, 'set', o);

			return o;
		})(super.BYTE_LENGTH);
	}

	assertEquals(B4Extra.BYTE_LENGTH, 28);
});
