/**
 * @module
 *
 * Native types.
 */

/**
 * Buffer pointer.
 *
 * @template TArrayBuffer Buffer type.
 */
export interface ArrayBufferPointer<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> {
	/**
	 * ArrayBuffer instance.
	 */
	readonly buffer: TArrayBuffer;

	/**
	 * Byte offset into buffer.
	 */
	readonly byteOffset: number;
}

/**
 * Get buffer type for a type.
 *
 * @template T Type.
 */
export type ArrayBufferType<T> = [T] extends [never] ? ArrayBufferLike
	: [T] extends [{ readonly buffer: ArrayBufferLike }] ? T['buffer']
	: ArrayBufferLike;
