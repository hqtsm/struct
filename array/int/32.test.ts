import { assertEquals } from '@std/assert';

import { ArrayInt32, ArrayUint32 } from './32.ts';

Deno.test('ArrayInt32 + ArrayUint32', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt32, ArrayUint32]) {
		const signed = ArrayInt === ArrayInt32;
		const type = signed ? 'int32' : 'uint32';
		const bpe = ArrayInt.BYTES_PER_ELEMENT;
		assertEquals(bpe, 4);
		assertEquals(ArrayInt.TYPE, type);
		assertEquals(ArrayInt.MEMBERS[2], {
			byteOffset: 8,
			byteLength: 4,
			littleEndian: null,
			type,
		});

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + 1);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			const le = a.littleEndian;
			for (let i = 0; i < count; i++) {
				a[i] = -1;
				assertEquals(view.getInt32(i * bpe, le), -1);
				view.setInt32(i * bpe, 1, le);
				assertEquals(a[i], 1);
			}
		}
	}
});
