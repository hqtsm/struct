import { assertEquals } from '@std/assert';

import { ArrayFloat32 } from './32.ts';

function round(n: number): number {
	const dataView = new DataView(new ArrayBuffer(4));
	dataView.setFloat32(0, n);
	return dataView.getFloat32(0);
}

Deno.test('ArrayFloat32', () => {
	const count = 3;
	assertEquals(ArrayFloat32.BYTES_PER_ELEMENT, 4);

	const fA = round(Math.PI);
	const fB = round(-Math.E);

	for (const littleEndian of [undefined, true, false]) {
		const buffer = new ArrayBuffer(
			ArrayFloat32.BYTES_PER_ELEMENT * count + 1,
		);
		const view = new DataView(buffer, 1);
		const a = new ArrayFloat32(buffer, 1, count, littleEndian);
		const le = a.littleEndian;
		for (let i = 0; i < count; i++) {
			a[i] = fA;
			assertEquals(view.getFloat32(i * a.bytesPerElement, le), fA);
			view.setFloat32(i * a.bytesPerElement, fB, le);
			assertEquals(a[i], fB);
		}
	}
});
