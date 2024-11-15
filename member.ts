import type { Member } from './type.ts';
import type { Struct } from './struct.ts';

/**
 * Member metadata.
 *
 * @param StructT Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param byteLength Byte length.
 * @returns Byte length.
 */
export function member<T extends typeof Struct>(
	StructT: T,
	name: keyof T['prototype'],
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
): number {
	const o: { [p: PropertyKey]: Member } = Object.hasOwn(StructT, 'MEMBERS')
		? StructT.MEMBERS
		: (StructT as { MEMBERS: T['MEMBERS'] }).MEMBERS = Object
			.create(StructT.MEMBERS);
	o[name] = { byteOffset, byteLength, littleEndian };
	return byteLength;
}
