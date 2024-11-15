/**
 * If A equals B then C else D.
 */
export type IfTypesEqual<A, B, C, D> = (<T>() => T extends A ? 1 : 2) extends
	<T>() => T extends B ? 1 : 2 ? C : D;

/**
 * Readonly keys for a given type.
 */
export type ReadonlyKeyof<T> = NonNullable<
	{
		[K in keyof T]: IfTypesEqual<
			{ [L in K]: T[K] },
			{ readonly [L in K]: T[K] },
			K,
			never
		>;
	}[keyof T]
>;

/**
 * Keys of a type that another type extends.
 */
export type KeyofExtends<T, E> = {
	[K in keyof T]: E extends T[K] ? K : never;
}[keyof T];

/**
 * Readonly keys of a type that another type extends.
 */
export type ReadonlyKeyofExtends<T, E> = {
	[K in ReadonlyKeyof<T>]: E extends T[K] ? K : never;
}[ReadonlyKeyof<T>];

/**
 * Array buffer type, excluding similar incompatible types like typed arrays.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Member info.
 */
export type Member = {
	/**
	 * Byte offset.
	 */
	byteOffset: number;

	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Little endian, big endian, or default.
	 */
	littleEndian: boolean | null;
};
