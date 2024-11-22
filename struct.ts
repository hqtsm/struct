import { LITTLE_ENDIAN } from './endian.ts';

/**
 * Possible members of a struct.
 */
export type Members<S extends Struct> = Exclude<keyof S, keyof Struct>;

/**
 * Possible members of a struct that another type extends.
 */
export type MembersExtends<S extends Struct, M> = Exclude<
	{ [K in keyof S]: M extends S[K] ? K : never }[keyof S],
	keyof Struct
>;

/**
 * Types of child structures.
 */
export type ChildTypes =
	| typeof Int8Array
	| typeof Uint8Array
	| typeof Uint8ClampedArray
	| typeof Struct;

/**
 * Types of member type.
 */
export type MemberTypes = string | ChildTypes;

/**
 * Member info.
 */
export type MemberInfo = {
	/**
	 * Byte offset.
	 */
	byteOffset: number;

	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Little endian, big endian, or default.
	 */
	littleEndian: boolean | null;

	/**
	 * Type of member.
	 */
	Type: MemberTypes;
};

/**
 * Member infos.
 */
export type MemberInfos = { [member: PropertyKey]: Readonly<MemberInfo> };

/**
 * Struct acceptable buffer type.
 * ArrayBuffer, not similar but incompatible types.
 */
export type StructBuffer = ArrayBufferLike & { BYTES_PER_ELEMENT?: never };

/**
 * Binary structure buffer view.
 */
export class Struct implements ArrayBufferView {
	declare public readonly ['constructor']: typeof Struct;

	/**
	 * Data view of buffer.
	 */
	readonly #dataView: DataView;

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
		buffer: StructBuffer,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		this.#dataView = new DataView(buffer, byteOffset);
		this.#littleEndian = littleEndian ?? LITTLE_ENDIAN;
	}

	/**
	 * @inheritdoc
	 */
	public get buffer(): ArrayBuffer {
		return this.#dataView.buffer;
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
		return this.#dataView.byteOffset;
	}

	/**
	 * Data view.
	 *
	 * @returns Data view of buffer.
	 */
	public get dataView(): DataView {
		return this.#dataView;
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
	public static readonly MEMBERS: Readonly<MemberInfos> = {};
}
