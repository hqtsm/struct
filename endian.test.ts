import { assertNotEquals } from '@std/assert';

import { BIG_ENDIAN, LITTLE_ENDIAN } from './endian.ts';

Deno.test('BIG_ENDIAN != LITTLE_ENDIAN', () => {
	assertNotEquals(BIG_ENDIAN, LITTLE_ENDIAN);
});