import type { Arr, ArrClass } from './arr.ts';
import type { Ptr, PtrClass } from './ptr.ts';
import type { Type, TypeClass } from './type.ts';

/**
 * Member info.
 */
export interface MemberInfo {
	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Byte offset.
	 */
	byteOffset: number;
}

/**
 * Member infos.
 */
export interface MemberInfos {
	/**
	 * Member infos.
	 */
	readonly [member: PropertyKey]: Readonly<MemberInfo>;
}

/**
 * With members.
 */
export interface Members {
	/**
	 * MemberInfoed class.
	 */
	readonly constructor: MembersClass;
}

/**
 * With members class.
 */
export interface MembersClass {
	/**
	 * MemberInfoed prototype.
	 */
	prototype: Members;

	/**
	 * Member infos of members.
	 */
	readonly MEMBERS: MemberInfos;

	/**
	 * Overlapping members (union), or non-overlapping members (struct, array).
	 */
	readonly OVERLAPPING: boolean;
}

/**
 * Membered types.
 */
export type Membered = Arr<unknown> | Ptr<unknown> | Type;

/**
 * Membered class types.
 */
export type MemberedClass =
	| ArrClass<Arr<unknown>>
	| PtrClass<Ptr<unknown>>
	| TypeClass;

/**
 * The possible member keys.
 */
export type MemberKeys<T extends Membered> = Exclude<
	keyof T,
	| (T extends Arr<unknown> ? Exclude<keyof Arr, number> : never)
	| (T extends Ptr<unknown> ? Exclude<keyof Ptr, number> : never)
	| (T extends Type ? keyof Type : never)
>;

/**
 * The possible member keys for class.
 */
export type MemberClassKeys<T extends MemberedClass> = MemberKeys<
	T['prototype']
>;

/**
 * Memberable types.
 */
export type Memberable = Arr<unknown> | Type;

/**
 * Memberable class types.
 */
export type MemberableClass = ArrClass<Arr<unknown>> | TypeClass;

/**
 * The possible memberable keys, filterable by member type.
 */
export type MemberableKeys<
	T extends Memberable,
	// deno-lint-ignore no-explicit-any
	M = any,
> = { [K in keyof T]: M extends T[K] ? K : never }[MemberKeys<T>];

/**
 * The possible memberable keys for class, filterable by member type.
 */
export type MemberableClassKeys<
	T extends MemberableClass,
	// deno-lint-ignore no-explicit-any
	M = any,
> = MemberableKeys<T['prototype'], M>;
