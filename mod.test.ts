import { assertEquals, assertMatch } from '@std/assert';
import * as mod from './mod.ts';

const defaultClassProperties = new Set(Object.getOwnPropertyNames(class {}));

Deno.test('class constants', () => {
	for (const [k, v] of Object.entries(mod)) {
		if (
			typeof v !== 'function' ||
			Object.getOwnPropertyDescriptor(v, 'prototype')?.writable
		) {
			continue;
		}
		for (const p of Object.getOwnPropertyNames(v)) {
			if (defaultClassProperties.has(p)) {
				continue;
			}
			const desc = Object.getOwnPropertyDescriptor(v, p);
			assertMatch(p, /^[a-zA-Z][a-zA-Z0-9_]*$/, `${k}.${p}`);
			assertEquals(desc!.writable ?? false, false, `${k}.${p}`);
		}
	}
});

Deno.test('class Symbol.toStringTag', () => {
	for (const [k, v] of Object.entries(mod)) {
		if (
			typeof v !== 'function' ||
			Object.getOwnPropertyDescriptor(v, 'prototype')?.writable
		) {
			continue;
		}
		const desc = Object.getOwnPropertyDescriptor(
			v.prototype,
			Symbol.toStringTag,
		);
		assertEquals(desc?.value, k, k);
	}
});
