import {
	assertEquals,
	assertNotStrictEquals,
	assertStrictEquals,
} from '@std/assert';

import { Struct } from './struct.ts';
import { memberView } from './view.ts';

Deno.test('member', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		declare public arr: Uint8Array;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += 16;
			o += memberView<typeof Test, Uint8Array>(
				this,
				'arr',
				o,
				32,
				false,
				Uint8Array,
				function (): Uint8Array {
					return new Uint8Array();
				},
				function (_: Uint8Array): void {},
			);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertNotStrictEquals(Test.MEMBERS, Struct.MEMBERS);
	assertEquals(Test.MEMBERS.arr.byteOffset, 16);
	assertEquals(Test.MEMBERS.arr.byteLength, 32);
	assertEquals(Test.MEMBERS.arr.littleEndian, false);
	assertEquals(Test.MEMBERS.arr.Type, Uint8Array);

	const test = new Test(new Uint8Array(Test.BYTE_LENGTH).buffer);
	assertStrictEquals(test.arr, test.arr);
});
