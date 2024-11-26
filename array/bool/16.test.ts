import { assertEquals } from '@std/assert';

import { ArrayBool16 } from './16.ts';

Deno.test('ArrayBool16', () => {
	const count = 3;
	assertEquals(ArrayBool16.BYTES_PER_ELEMENT, 2);

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(
			ArrayBool16.BYTES_PER_ELEMENT * count + 1,
		);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool16(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt16(i * a.bytesPerElement, le), 1);
			a[i] = false;
			assertEquals(view.getInt16(i * a.bytesPerElement, le), 0);
			view.setInt16(i * a.bytesPerElement, -1, le);
			assertEquals(a[i], true);
		}
	}
});
