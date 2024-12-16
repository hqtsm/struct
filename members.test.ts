import { assertEquals } from '@std/assert/equals';
import { array } from './arr.ts';
import { Uint8Ptr } from './int/8.ts';
import { uint32 } from './int/32.ts';
import { member } from './member.ts';
import { Struct } from './struct.ts';

Deno.test('ClassMemberable: additional member', () => {
	class Foo extends Struct {
		declare public bar: number;

		declare public baz: number;

		static {
			uint32(this, 'bar');
			uint32(this, 'baz');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'byteLength');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'byteOffset');
		}
	}

	assertEquals(Foo.BYTE_LENGTH, 16);
});

Deno.test('ClassMemberable: extends member', () => {
	class Child extends Struct {
		declare public one: number;

		declare public two: number;

		static {
			uint32(this, 'one');
			uint32(this, 'two');
		}
	}

	class Parent extends Struct {
		declare public get: Child;

		declare public set: Child;

		declare public length: number;

		declare public gamma: Child;

		static {
			// Not an array, so we can use these.
			member(Child, this, 'get');
			member(Child, this, 'set');
			uint32(this, 'length');

			// @ts-expect-error: Does not extend the member type.
			member(Struct, this, 'gamma');

			// @ts-expect-error: Does not exist in membered type.
			uint32(this, 'unknown');

			// A way to have undeclared members.
			uint32(this, 'hidden' as never);
		}
	}

	assertEquals(Parent.BYTE_LENGTH, 28);
});

Deno.test('ClassMemberable: array properties', () => {
	const B4 = array(Uint8Ptr, 4);

	// Weird but not invalid.
	class B4Extra extends B4 {
		declare public extra: number;

		static {
			uint32(this, 'extra');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'byteLength');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'byteOffset');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'length');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'get');

			// @ts-expect-error: A non-member built-in property.
			uint32(this, 'set');

			// Extremely weird, not recommended, but not technically invalid.
			uint32(this, 0);
		}
	}

	assertEquals(B4Extra.BYTE_LENGTH, 32);
});
