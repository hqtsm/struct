import { LITTLE_ENDIAN } from './endian.ts';
import type { ArrayBufferReal, MemberInfos, Type } from './type.ts';
import { dataView } from './util.ts';

let members: WeakMap<typeof Struct, MemberInfos>;

/**
 * Binary structure buffer view.
 */
export class Struct implements Type {
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
	 * Little endian, or big.
	 */
	readonly #littleEndian: boolean;

	/**
	 * Struct constructor.
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

	public get byteLength(): number {
		return this.constructor.BYTE_LENGTH;
	}

	public get byteOffset(): number {
		return this.#byteOffset;
	}

	public get littleEndian(): boolean {
		return this.#littleEndian;
	}

	/**
	 * Byte length of struct.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): Readonly<MemberInfos> {
		let r = (members ??= new WeakMap()).get(this);
		if (!r) {
			members.set(
				this,
				r = Object.create(
					Object.getPrototypeOf(this).MEMBERS ?? null,
				) as Readonly<MemberInfos>,
			);
		}
		return r;
	}
}
