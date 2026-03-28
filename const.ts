/**
 * @module
 *
 * Types for constant types.
 */

import type { Arr } from './arr.ts';
import type { ArrayBufferType } from './native.ts';
import type { Ptr } from './ptr.ts';

/**
 * Constant type.
 *
 * @template T Type.
 */
// deno-lint-ignore ban-types
export type Const<T> = T extends Function | RegExp | Date ? T
	: T extends Arr<unknown> ? ConstArr<T> & Const<Omit<T, keyof Arr>>
	: T extends Ptr<unknown> ? ConstPtr<T> & Const<Omit<T, keyof Ptr>>
	: T extends object ? { readonly [K in keyof T]: Const<T[K]> }
	: T;

/**
 * Constant pointer.
 *
 * @template T Pointer type.
 */
interface ConstPtr<T extends Ptr<unknown>>
	extends Const<Omit<Ptr<Const<T[number]>, ArrayBufferType<T>>, 'set'>> {}

/**
 * Constant array.
 *
 * @template T Array type.
 */
interface ConstArr<T extends Arr<unknown>>
	extends Const<Omit<Arr<Const<T[number]>, ArrayBufferType<T>>, 'set'>> {}
