import { assertEquals } from '@std/assert';

import { ArrayBool8 } from './8.ts';

Deno.test('ArrayBool8', () => {
	const count = 3;
	const bpe = ArrayBool8.BYTES_PER_ELEMENT;
	assertEquals(bpe, 1);
	assertEquals(ArrayBool8.TYPE, 'bool8');
	assertEquals(ArrayBool8.MEMBERS[2], {
		byteOffset: 2,
		byteLength: 1,
		littleEndian: null,
		type: 'bool8',
	});

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + 1);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool8(buffer, 1, count, littleEndian);
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt8(i * bpe), 1);
			a[i] = false;
			assertEquals(view.getInt8(i * bpe), 0);
			view.setInt8(i * bpe, -1);
			assertEquals(a[i], true);
		}
	}
});
