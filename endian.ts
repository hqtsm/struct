import type { ArrayBufferReal, BufferPointer, EndianAware } from './type.ts';
import { dataView } from './util.ts';

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

/**
 * Endian aware buffer pointer.
 */
export class Endian implements BufferPointer, EndianAware {
	/**
	 * Endian class.
	 */
	declare public readonly ['constructor']: Omit<typeof Endian, 'new'>;

	/**
	 * Buffer data.
	 */
	readonly #buffer: ArrayBufferLike;

	/**
	 * Byte offset into buffer.
	 */
	readonly #byteOffset: number;

	/**
	 * Little endian, or big.
	 */
	readonly #littleEndian: boolean;

	/**
	 * EndianPointer constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		dataView(this.#buffer = buffer);
		if (byteOffset < -0x1fffffffffffff || byteOffset > 0x1fffffffffffff) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		this.#byteOffset = byteOffset - byteOffset % 1 || 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
	}

	public get buffer(): ArrayBufferLike {
		return this.#buffer;
	}

	public get byteOffset(): number {
		return this.#byteOffset;
	}

	public get littleEndian(): boolean {
		return this.#littleEndian;
	}
}
