import type { MembersExtends, MemberTypes } from '../type.ts';
import type { Struct } from '../struct.ts';

import { memberValue } from './value.ts';

/**
 * Member view.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param byteLength Byte length.
 * @param littleEndian Little endian, big endian, or default.
 * @param Type Member type.
 * @param get Member getter.
 * @param set Member setter.
 * @returns Byte length.
 */
export function memberView<C extends typeof Struct, T>(
	StructC: C,
	name: MembersExtends<C, T>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: MemberTypes,
	get: (this: C['prototype']) => T,
	set: (this: C['prototype'], value: T) => void,
): number {
	const m = new WeakMap<C['prototype'], T>();
	return memberValue(
		StructC,
		name,
		byteOffset,
		byteLength,
		littleEndian,
		Type,
		function (): T {
			let r = m.get(this);
			if (!r) {
				r = get.call(this);
				m.set(this, r);
			}
			return r;
		},
		set,
	);
}
