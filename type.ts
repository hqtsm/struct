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
 * Keys for a given value type.
 */
export type KeyofType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Readonly keys for a given value type.
 */
export type ReadonlyKeyofType<T, U> = {
	[K in ReadonlyKeyof<T>]: T[K] extends U ? K : never;
}[ReadonlyKeyof<T>];

/**
 * Array buffer type, excluding similar incompatible types like typed arrays.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Buffer view.
 */
export interface BufferView {
	/**
	 * Array buffer.
	 */
	readonly buffer: ArrayBufferLike;

	/**
	 * Byte length.
	 */
	readonly byteLength: number;

	/**
	 * Byte offset.
	 */
	readonly byteOffset: number;
}
