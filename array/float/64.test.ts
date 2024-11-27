import { assertEquals } from '@std/assert';

import { ArrayFloat64 } from './64.ts';

Deno.test('ArrayFloat64', () => {
	const count = 3;
	const bpe = ArrayFloat64.BYTES_PER_ELEMENT;
	assertEquals(bpe, 8);

	const fA = Math.PI;
	const fB = -Math.E;

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(bpe * count + 1);
		const view = new DataView(buffer, 1);
		const a = new ArrayFloat64(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = fA;
			assertEquals(view.getFloat64(i * bpe, le), fA);
			view.setFloat64(i * bpe, fB, le);
			assertEquals(a[i], fB);
		}
	}
});
