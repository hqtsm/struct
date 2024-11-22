import type {
	MemberInfos,
	MembersExtends,
	MemberTypes,
	Struct,
} from './struct.ts';

/**
 * Member value.
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
export function memberValue<C extends typeof Struct, M>(
	StructC: C & { MEMBERS: MemberInfos },
	name: MembersExtends<C['prototype'], M>,
	byteOffset: number,
	byteLength: number,
	littleEndian: boolean | null,
	Type: MemberTypes,
	get: (this: C['prototype']) => M,
	set: (this: C['prototype'], value: M) => void,
): number {
	Object.defineProperty(StructC.prototype, name, {
		get,
		set,
		configurable: true,
		enumerable: false,
	});
	(
		Object.hasOwn(StructC, 'MEMBERS')
			? StructC.MEMBERS
			: StructC.MEMBERS = Object.create(StructC.MEMBERS)
	)[name] = {
		byteOffset,
		byteLength,
		littleEndian,
		Type,
	};
	return byteLength;
}
