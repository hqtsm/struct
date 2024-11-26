import { assertEquals } from '@std/assert';

import { ArrayInt16, ArrayUint16 } from './16.ts';

Deno.test('ArrayInt16 + ArrayUint16', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt16, ArrayUint16]) {
		assertEquals(ArrayInt.BYTES_PER_ELEMENT, 2);

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(
				ArrayInt.BYTES_PER_ELEMENT * count + 1,
			);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			const le = a.littleEndian;
			for (let i = 0; i < count; i++) {
				a[i] = -1;
				assertEquals(view.getInt16(i * a.bytesPerElement, le), -1);
				view.setInt16(i * a.bytesPerElement, 1, le);
				assertEquals(a[i], 1);
			}
		}
	}
});