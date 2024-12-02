import { assertEquals } from '@std/assert';

import { ArrayBool32 } from './32.ts';

Deno.test('ArrayBool32', () => {
	const count = 3;
	const bpe = ArrayBool32.BYTES_PER_ELEMENT;
	assertEquals(bpe, 4);
	assertEquals(ArrayBool32.MEMBERS[2], {
		byteOffset: 8,
		byteLength: 4,
	});

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + 1);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool32(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt32(i * bpe, le), 1);
			a[i] = false;
			assertEquals(view.getInt32(i * bpe, le), 0);
			view.setInt32(i * bpe, -1, le);
			assertEquals(a[i], true);
		}
	}
});
