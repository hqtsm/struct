import { assertEquals } from '@std/assert';

import { ArrayBool32 } from './32.ts';

Deno.test('ArrayBool32', () => {
	const count = 3;
	assertEquals(ArrayBool32.BYTES_PER_ELEMENT, 4);

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(
			ArrayBool32.BYTES_PER_ELEMENT * count + 1,
		);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool32(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt32(i * a.bytesPerElement, le), 1);
			a[i] = false;
			assertEquals(view.getInt32(i * a.bytesPerElement, le), 0);
			view.setInt32(i * a.bytesPerElement, -1, le);
			assertEquals(a[i], true);
		}
	}
});
