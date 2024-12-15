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
 * Member infoed.
 */
export interface MemberInfoed {
	/**
	 * MemberInfoed class.
	 */
	readonly constructor: MemberInfoedClass;
}

/**
 * Member infoed class.
 */
export interface MemberInfoedClass {
	/**
	 * MemberInfoed prototype.
	 */
	prototype: MemberInfoed;

	/**
	 * Member infos of members.
	 */
	readonly MEMBERS: MemberInfos;
}

/**
 * Membered types.
 */
export type Membered = Arr<unknown> | Ptr<unknown> | Type;

/**
 * Membered class types.
 */
export type ClassMembered =
	| ArrClass<Arr<unknown>>
	| PtrClass<Ptr<unknown>>
	| TypeClass;

/**
 * The possible member keys.
 */
export type Members<T extends Membered> = Exclude<
	keyof T,
	| (T extends Arr<unknown> ? Exclude<keyof Arr, number> : never)
	| (T extends Ptr<unknown> ? Exclude<keyof Ptr, number> : never)
	| (T extends Type ? keyof Type : never)
>;

/**
 * The possible member keys for class.
 */
export type ClassMembers<T extends ClassMembered> = Members<T['prototype']>;

/**
 * Memberable types.
 */
export type Memberables = Arr<unknown> | Type;

/**
 * Memberable class types.
 */
export type ClassMemberables = ArrClass<Arr<unknown>> | TypeClass;

/**
 * The possible memberable keys, filterable by member type.
 */
export type Memberable<
	T extends Memberables,
	// deno-lint-ignore no-explicit-any
	M = any,
> = { [K in keyof T]: M extends T[K] ? K : never }[Members<T>];

/**
 * The possible memberable keys for class, filterable by member type.
 */
export type ClassMemberable<
	T extends ClassMemberables,
	// deno-lint-ignore no-explicit-any
	M = any,
> = Memberable<T['prototype'], M>;
