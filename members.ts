import type { Type } from './type.ts';

/**
 * The possible member keys.
 */
export type Members<T extends Type> = Exclude<keyof T, keyof Type>;

/**
 * The possible member keys, that member type extends.
 */
export type MembersExtends<T extends Type, M> = {
	[K in Members<T>]: M extends T[K] ? K : never;
}[Members<T>];
