/**
 * @module
 *
 * Types for constant types.
 */

import type { Arr } from './arr.ts';
import type { Ptr } from './ptr.ts';

/**
 * Constant type.
 */
// deno-lint-ignore ban-types
export type Const<T> = T extends Function | RegExp | Date ? T
	: T extends Arr<infer V> ? ConstArr<V> & Const<Omit<T, keyof Arr>>
	: T extends Ptr<infer V> ? ConstPtr<V> & Const<Omit<T, keyof Ptr>>
	: T extends object ? { readonly [K in keyof T]: Const<T[K]> }
	: T;

/**
 * Constant pointer.
 */
export interface ConstPtr<T = never>
	extends Const<Omit<Ptr<Const<T>>, 'set'>> {}

/**
 * Constant array.
 */
export interface ConstArr<T = never>
	extends Const<Omit<Arr<Const<T>>, 'set'>> {}
