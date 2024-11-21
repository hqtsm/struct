import type { MembersExtends, MemberTypes } from './type.ts';
import type { Struct } from './struct.ts';
import { assignView } from './macro.ts';
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
 * @param set Member setter, or null for default assign view.
 * @returns Byte length.
 */
export function memberView<C extends typeof Struct, M extends ArrayBufferView>(
	StructC: C,
	name: MembersExtends<C['prototype'], M>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: MemberTypes,
	get: (this: C['prototype']) => M,
	set: ((this: C['prototype'], value: M) => void) | null = null,
): number {
	const m = new WeakMap<C['prototype'], M>();
	return memberValue(
		StructC,
		name,
		byteOffset,
		byteLength,
		littleEndian,
		Type,
		function (): M {
			let r = m.get(this);
			if (!r) {
				r = get.call(this);
				m.set(this, r);
			}
			return r;
		},
		set || function (value: M): void {
			assignView(this[name] as M, value);
		},
	);
}
