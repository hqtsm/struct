import { assertEquals } from '@std/assert';

import { ArrayBool16 } from './16.ts';

Deno.test('ArrayBool16', () => {
	const count = 3;
	const bpe = ArrayBool16.BYTES_PER_ELEMENT;
	assertEquals(bpe, 2);
	assertEquals(ArrayBool16.MEMBERS[2], {
		byteOffset: 4,
		byteLength: 2,
		littleEndian: null,
	});

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + 1);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool16(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt16(i * bpe, le), 1);
			a[i] = false;
			assertEquals(view.getInt16(i * bpe, le), 0);
			view.setInt16(i * bpe, -1, le);
			assertEquals(a[i], true);
		}
	}
});
