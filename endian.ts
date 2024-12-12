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

let pri: WeakMap<Endian, BufferPointer & EndianAware>;

/**
 * Endian aware buffer pointer.
 */
export class Endian implements BufferPointer, EndianAware {
	/**
	 * Endian class.
	 */
	declare public readonly ['constructor']: Omit<typeof Endian, 'new'>;

	/**
	 * Create instance for buffer.
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
		dataView(buffer);
		if (byteOffset < -0x1fffffffffffff || byteOffset > 0x1fffffffffffff) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		(pri ??= new WeakMap()).set(this, {
			buffer,
			byteOffset: byteOffset - byteOffset % 1 || 0,
			littleEndian: !!(littleEndian ?? LITTLE_ENDIAN),
		});
	}

	public get buffer(): ArrayBufferLike {
		return pri.get(this)!.buffer;
	}

	public get byteOffset(): number {
		return pri.get(this)!.byteOffset;
	}

	public get littleEndian(): boolean {
		return this.constructor.LITTLE_ENDIAN ?? pri.get(this)!.littleEndian;
	}

	/**
	 * Type level endian override.
	 */
	public static LITTLE_ENDIAN: boolean | null = null;
}
