import type { Member, Members } from './type.ts';
import type { Struct } from './struct.ts';

/**
 * Set member info.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param byteLength Byte length.
 * @param littleEndian Little endian, big endian, or default.
 * @param Type Member type.
 * @returns Byte length.
 */
export function member<C extends typeof Struct>(
	StructC: C,
	name: Members<C>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: string | typeof Struct,
): number {
	const o: { [p: PropertyKey]: Member } = Object.hasOwn(StructC, 'MEMBERS')
		? StructC.MEMBERS
		: (StructC as { MEMBERS: C['MEMBERS'] }).MEMBERS = Object
			.create(StructC.MEMBERS);
	o[name] = { byteOffset, byteLength, littleEndian, Type };
	return byteLength;
}
