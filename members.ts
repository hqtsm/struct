import type { Arr, ArrClass } from './arr.ts';
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
 * Membered type.
 */
export interface Membered {
	/**
	 * Member infos of members.
	 */
	readonly MEMBERS: MemberInfos;
}

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
> = {
	[K in keyof T]: M extends T[K] ? K : never;
}[Exclude<keyof T, T extends Arr<unknown> ? keyof Arr : keyof Type>];

/**
 * The possible memberable keys for class, filterable by member type.
 */
export type ClassMemberable<
	T extends ArrClass | TypeClass,
	// deno-lint-ignore no-explicit-any
	M = any,
> = Memberable<T['prototype'], M>;
