import { LITTLE_ENDIAN } from './endian.ts';
import type { ArrayBufferReal, MemberInfos, Type } from './type.ts';
import { dataView } from './util.ts';

/**
 * Binary structure buffer view.
 */
export class Struct implements Type {
	/**
	 * @inheritdoc
	 */
	declare public readonly ['constructor']: Omit<typeof Struct, 'new'>;

	/**
	 * Buffer data.
	 */
	readonly #buffer: ArrayBufferLike;

	/**
	 * Byte offset into buffer.
	 */
	readonly #byteOffset: number;

	/**
	 * Little endian, or not.
	 */
	readonly #littleEndian: boolean;

	/**
	 * @inheritdoc
	 */
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		dataView(this.#buffer = buffer);
		if (byteOffset < 0) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		this.#byteOffset = byteOffset | 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
	}

	/**
	 * @inheritdoc
	 */
	public get buffer(): ArrayBufferLike {
		return this.#buffer;
	}

	/**
	 * @inheritdoc
	 */
	public get byteLength(): number {
		return this.constructor.BYTE_LENGTH;
	}

	/**
	 * @inheritdoc
	 */
	public get byteOffset(): number {
		return this.#byteOffset;
	}

	/**
	 * @inheritdoc
	 */
	public get littleEndian(): boolean {
		return this.#littleEndian;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * @inheritdoc
	 */
	public static readonly MEMBERS: Readonly<MemberInfos> = {};
}
