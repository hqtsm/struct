import { assertEquals } from '@std/assert';

import { ArrayInt8, ArrayUint8 } from './8.ts';

Deno.test('ArrayInt8 + ArrayUint8', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt8, ArrayUint8]) {
		assertEquals(ArrayInt.BYTES_PER_ELEMENT, 1);

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(
				ArrayInt.BYTES_PER_ELEMENT * count + 1,
			);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			for (let i = 0; i < count; i++) {
				a[i] = -1;
				assertEquals(view.getInt8(i * a.bytesPerElement), -1);
				view.setInt8(i * a.bytesPerElement, 1);
				assertEquals(a[i], 1);
			}
		}
	}
});
