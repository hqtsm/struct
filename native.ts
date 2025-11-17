/**
 * @module
 *
 * Native types.
 */

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
