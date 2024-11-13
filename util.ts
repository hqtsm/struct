/**
 * Get 24-bit signed integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param littleEndian Little endian.
 * @returns Integer value.
 */
export function getInt24(
	dataView: DataView,
	offset: number,
	littleEndian: boolean,
): number {
	return (getUint24(dataView, offset, littleEndian) << 8) >> 8;
}

/**
 * Get 24-bit unsigned integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param littleEndian Little endian.
 * @returns Integer value.
 */
export function getUint24(
	dataView: DataView,
	offset: number,
	littleEndian: boolean,
): number {
	const c = dataView.getUint8(offset + 2);
	const b = dataView.getUint8(offset + 1);
	const a = dataView.getUint8(offset);
	return littleEndian ? a | (b << 8) | (c << 16) : (a << 16) | (b << 8) | c;
}

/**
 * Set 24-bit signed integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param value Integer value.
 * @param littleEndian Little endian.
 */
export function setInt24(
	dataView: DataView,
	offset: number,
	value: number,
	littleEndian: boolean,
): void {
	setUint24(dataView, offset, value, littleEndian);
}

/**
 * Set 24-bit unsigned integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param value Integer value.
 * @param littleEndian Little endian.
 */
export function setUint24(
	dataView: DataView,
	offset: number,
	value: number,
	littleEndian: boolean,
): void {
	let c;
	let b;
	let a;
	if (littleEndian) {
		c = (value >>> 16) & 0xff;
		b = (value >>> 8) & 0xff;
		a = (value >>> 0) & 0xff;
	} else {
		c = (value >>> 0) & 0xff;
		b = (value >>> 8) & 0xff;
		a = (value >>> 16) & 0xff;
	}
	if (offset <= -1) {
		// Trigger native OOB exception.
		dataView.setUint8(offset, a);
	}
	dataView.setUint8(offset + 2, c);
	dataView.setUint8(offset + 1, b);
	dataView.setUint8(offset, a);
}
