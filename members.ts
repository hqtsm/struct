import type { Type } from './type.ts';

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
 * The possible member keys, filterable by member type.
 */
// deno-lint-ignore no-explicit-any
export type Members<T extends Type, M = any> = {
	[K in keyof T]: M extends T[K] ? K : never;
}[Exclude<keyof T, keyof Type>];
