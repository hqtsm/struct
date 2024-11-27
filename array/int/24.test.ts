import { getInt24, setInt24 } from '@hqtsm/dataview/int/24';
import { assertEquals } from '@std/assert';

import { ArrayInt24, ArrayUint24 } from './24.ts';

Deno.test('ArrayInt24 + ArrayUint24', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt24, ArrayUint24]) {
		assertEquals(ArrayInt.BYTES_PER_ELEMENT, 3);

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(
				ArrayInt.BYTES_PER_ELEMENT * count + 1,
			);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			const le = a.littleEndian;
			for (let i = 0; i < count; i++) {
				a[i] = -1;
				assertEquals(getInt24(view, i * a.bytesPerElement, le), -1);
				setInt24(view, i * a.bytesPerElement, 1, le);
				assertEquals(a[i], 1);
			}
		}
	}
});
