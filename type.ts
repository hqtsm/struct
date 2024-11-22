/**
 * Keys of a type that another type extends.
 */
export type KeyofExtends<T, E> = {
	[K in keyof T]: E extends T[K] ? K : never;
}[keyof T];

/**
 * Array buffer type, excluding similar incompatible types like typed arrays.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };
