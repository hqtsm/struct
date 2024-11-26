import { assertEquals } from '@std/assert';
import { ArrayBool8 } from './8.ts';

Deno.test('ArrayBool8', () => {
	const count = 3;
	assertEquals(ArrayBool8.BYTES_PER_ELEMENT, 1);

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(
			ArrayBool8.BYTES_PER_ELEMENT * count + 1,
		);
		const view = new DataView(buffer, 1);
		const a = new ArrayBool8(buffer, 1, count, littleEndian);
		for (let i = 0; i < count; i++) {
			a[i] = true;
			assertEquals(view.getInt8(i * a.bytesPerElement), 1);
			a[i] = false;
			assertEquals(view.getInt8(i * a.bytesPerElement), 0);
			view.setInt8(i * a.bytesPerElement, -1);
			assertEquals(a[i], true);
		}
	}
});
