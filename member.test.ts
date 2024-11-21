import { assertEquals, assertNotStrictEquals } from '@std/assert';

import { Struct } from './struct.ts';
import { member } from './member.ts';

Deno.test('member', () => {
	class Test extends Struct {
		declare public readonly ['constructor']: typeof Test;

		public static override readonly BYTE_LENGTH: number = ((o) => {
			o += 16;
			o += member(
				this,
				'unk' as never,
				o,
				32,
				false,
				'unk32',
				function (): number {
					return 0;
				},
				function (): void {},
			);
			return o;
		})(super.BYTE_LENGTH);
	}

	assertNotStrictEquals(Test.MEMBERS, Struct.MEMBERS);
	assertEquals(Test.MEMBERS.unk.byteOffset, 16);
	assertEquals(Test.MEMBERS.unk.byteLength, 32);
	assertEquals(Test.MEMBERS.unk.littleEndian, false);
	assertEquals(Test.MEMBERS.unk.Type, 'unk32');
});
