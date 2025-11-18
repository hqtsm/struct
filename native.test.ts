import { assert } from '@std/assert';
import type { ArrayBufferPointer } from './native.ts';

Deno.test('ArrayBufferPointer', () => {
	assert(
		{
			buffer: new ArrayBuffer(0),
			byteOffset: 0,
		} satisfies ArrayBufferPointer<ArrayBuffer>,
	);
	assert(
		{
			buffer: new SharedArrayBuffer(0),
			byteOffset: 0,
		} satisfies ArrayBufferPointer<SharedArrayBuffer>,
	);
});
