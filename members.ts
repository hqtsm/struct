/**
 * @module
 *
 * Types for members.
 */

import type { Class } from '@hqtsm/class';
import type { Arr, ArrConstructor } from './arr.ts';
import type { Ptr, PtrConstructor } from './ptr.ts';
import type { Type, TypeConstructor } from './type.ts';

/**
 * If types are equal.
 *
 * @template A Type A.
 * @template B Type B.
 * @template T True type.
 * @template F False type.
 */
type TypesEqual<A, B, T, F> = (
	<T>() => T extends A ? 1 : 2
) extends (
	<T>() => T extends B ? 1 : 2
) ? T
	: F;

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
	| ArrConstructor<Arr<unknown>>
	| PtrConstructor<Ptr<unknown>>
	| TypeConstructor;

/**
 * The possible member keys.
 *
 * @template T Membered type.
 */
export type MemberKeys<T extends Membered> = Exclude<
	keyof T,
	| (T extends Arr<unknown> ? Exclude<keyof Arr, number> : never)
	| (T extends Ptr<unknown> ? Exclude<keyof Ptr, number> : never)
	| (T extends Type ? keyof Type : never)
>;

/**
 * The possible member keys for class.
 *
 * @template T Membered class type.
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
export type MemberableClass =
	| Class<ArrConstructor<Arr<unknown>>>
	| Class<TypeConstructor>;

/**
 * The possible memberable keys, filterable by member type.
 *
 * @template T Memberable type.
 * @template M Member type.
 */
export type MemberableKeys<
	T extends Memberable,
	// deno-lint-ignore no-explicit-any
	M = any,
> = {
	[K in keyof T]: TypesEqual<T[K], M, K, M extends T[K] ? K : never>;
}[MemberKeys<T>];

/**
 * The possible memberable keys for class, filterable by member type.
 *
 * @template T Memberable class type.
 * @template M Member type.
 */
export type MemberableClassKeys<
	T extends MemberableClass,
	// deno-lint-ignore no-explicit-any
	M = any,
> = MemberableKeys<T['prototype'], M>;
