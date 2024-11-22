/**
 * Is host big endian.
 */
export const BIG_ENDIAN: boolean = !new Uint8Array(
	new Uint16Array([1]).buffer,
)[0];

/**
 * Is host little endian.
 */
export const LITTLE_ENDIAN = !BIG_ENDIAN;
