// deno-lint-ignore-file ban-types
import type { Arr } from './arr.ts';
import type { Ptr } from './ptr.ts';

export type Const<T> = T extends Function | RegExp | Date ? T
	: T extends Arr<infer V> ? ConstArr<V> & Const<Omit<T, keyof Arr>>
	: T extends Ptr<infer V> ? ConstPtr<V> & Const<Omit<T, keyof Ptr>>
	: T extends {} ? { readonly [K in keyof T]: Const<T[K]> }
	: T;

export interface ConstPtr<T = never>
	extends Readonly<Omit<Ptr<Const<T>>, 'set'>> {}

export interface ConstArr<T = never>
	extends Readonly<Omit<Arr<Const<T>>, 'set'>> {}
