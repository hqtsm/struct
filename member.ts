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
	name: Exclude<keyof T['prototype'], keyof Struct>,
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
