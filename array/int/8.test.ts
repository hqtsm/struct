import { assertEquals } from '@std/assert';

import { ArrayInt8, ArrayUint8 } from './8.ts';

Deno.test('ArrayInt8 + ArrayUint8', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt8, ArrayUint8]) {
		const signed = ArrayInt === ArrayInt8;
		const type = signed ? 'int8' : 'uint8';
		const bpe = ArrayInt.BYTES_PER_ELEMENT;
		assertEquals(bpe, 1);
		assertEquals(ArrayInt.TYPE, type);
		assertEquals(ArrayInt.MEMBERS[2], {
			byteOffset: 2,
			byteLength: 1,
			littleEndian: null,
			type,
		});

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + 1);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			for (let i = 0; i < count; i++) {
				a[i] = -1;
				assertEquals(view.getInt8(i * bpe), -1);
				view.setInt8(i * bpe, 1);
				assertEquals(a[i], 1);
			}
		}
	}
});
