/**
 * ArrayBufferLike, not similar but incompatible types.
 */
export type ArrayBufferReal = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };
