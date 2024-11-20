import type { Member, Members } from './type.ts';
import type { Struct } from './struct.ts';

/**
 * Set member info.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param byteLength Byte length.
 * @param littleEndian Little endian, big endian, or default.
 * @param Type Member type.
 * @returns Byte length.
 */
export function member<T extends typeof Struct>(
	StructT: T,
	name: Members<T>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: string | typeof Struct,
): number {
	const o: { [p: PropertyKey]: Member } = Object.hasOwn(StructT, 'MEMBERS')
		? StructT.MEMBERS
		: (StructT as { MEMBERS: T['MEMBERS'] }).MEMBERS = Object
			.create(StructT.MEMBERS);
	o[name] = { byteOffset, byteLength, littleEndian, Type };
	return byteLength;
}
