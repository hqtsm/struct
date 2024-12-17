/**
 * @module
 *
 * Native types.
 */

/**
 * ArrayBufferLike, not similar but incompatible types.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Buffer pointer.
 */
export interface BufferPointer {
	/**
	 * ArrayBuffer instance.
	 */
	readonly buffer: ArrayBufferLike;

	/**
	 * Byte offset into buffer.
	 */
	readonly byteOffset: number;
}

/**
 * Buffer view.
 */
export interface BufferView extends BufferPointer {
	/**
	 * Byte length of view.
	 */
	readonly byteLength: number;
}
