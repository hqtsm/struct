import { assertEquals } from '@std/assert';

import { ArrayInt64, ArrayUint64 } from './64.ts';

Deno.test('ArrayInt64 + ArrayUint64', () => {
	const count = 3;
	for (const ArrayInt of [ArrayInt64, ArrayUint64]) {
		const bpe = ArrayInt.BYTES_PER_ELEMENT;
		assertEquals(bpe, 8);
		assertEquals(ArrayInt.KIND, 'int');
		assertEquals(ArrayInt.SIGNED, ArrayInt === ArrayInt64);
		assertEquals(ArrayInt.TYPE, BigInt);

		for (const littleEndian of [undefined, true, false]) {
			const buffer = new ArrayBuffer(bpe * count + 1);
			const view = new DataView(buffer, 1);
			const a = new ArrayInt(buffer, 1, count, littleEndian);
			const le = a.littleEndian;
			for (let i = 0; i < count; i++) {
				a[i] = -1n;
				assertEquals(view.getBigInt64(i * bpe, le), -1n);
				view.setBigInt64(i * bpe, 1n, le);
				assertEquals(a[i], 1n);
			}
		}
	}
});
