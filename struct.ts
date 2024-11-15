import { LITTLE_ENDIAN } from './const.ts';
import type { ArrayBufferReal, Member } from './type.ts';

/**
 * Binary structure buffer view.
 */
export class Struct implements ArrayBufferView {
	declare public readonly ['constructor']: typeof Struct;

	/**
	 * Data view of buffer.
	 */
	readonly #data: DataView;

	/**
	 * Little endian, or not.
	 */
	readonly #littleEndian: boolean;

	/**
	 * Blob constructor.
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
		this.#data = new DataView(buffer, byteOffset);
		this.#littleEndian = littleEndian ?? LITTLE_ENDIAN;
	}

	/**
	 * @inheritdoc
	 */
	public get buffer(): ArrayBuffer {
		return this.#data.buffer;
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
		return this.#data.byteOffset;
	}

	/**
	 * Data view.
	 *
	 * @returns Data view of buffer.
	 */
	public get dataView(): DataView {
		return this.#data;
	}

	/**
	 * Using little endian or big endian for host-defined endian fields.
	 * Defaults to match the host architecture.
	 *
	 * @returns True for little endian, false for big endian.
	 */
	public get littleEndian(): boolean {
		return this.#littleEndian;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Member info.
	 */
	public static readonly MEMBERS: Readonly<
		{ [member: PropertyKey]: Readonly<Member> }
	> = {};
}
