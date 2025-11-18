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
