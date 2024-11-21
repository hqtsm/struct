import type { Member, MembersExtends, MemberTypes } from '../type.ts';
import type { Struct } from '../struct.ts';

/**
 * Set member info.
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
export function memberValue<C extends typeof Struct, T>(
	StructC: C,
	name: MembersExtends<C, T>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: MemberTypes,
	get: (this: C['prototype']) => T,
	set: (this: C['prototype'], value: T) => void,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get,
		set,
		configurable: true,
	});
	const o: { [p: PropertyKey]: Member } = Object.hasOwn(StructC, 'MEMBERS')
		? StructC.MEMBERS
		: (StructC as { MEMBERS: C['MEMBERS'] }).MEMBERS = Object
			.create(StructC.MEMBERS);
	o[name] = { byteOffset, byteLength, littleEndian, Type };
	return byteLength;
}
