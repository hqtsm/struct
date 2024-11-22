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
export type ChildTypes = unknown;

/**
 * Types of member type.
 */
// deno-lint-ignore ban-types
export type MemberInfoType = Function | null;

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
	 * Kind of member.
	 */
	kind: string;

	/**
	 * Signed or unsigned type, if applicable.
	 */
	signed: boolean | null;

	/**
	 * Type of member.
	 */
	Type: MemberInfoType;
};

/**
 * Member infos.
 */
export type MemberInfos = { [member: PropertyKey]: Readonly<MemberInfo> };

export type Membered = {
	readonly prototype: typeof Struct['prototype'];

	readonly MEMBERS: Readonly<MemberInfos>;
};

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
	 * Buffer data.
	 */
	readonly #buffer: StructBuffer;

	/**
	 * Byte offset into buffer.
	 */
	readonly #byteOffset: number;

	/**
	 * Little endian, or not.
	 */
	readonly #littleEndian: boolean;

	/**
	 * Data view of buffer, lazy init.
	 */
	#dataView?: DataView;

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
		if ((byteOffset |= 0) < 0) {
			new DataView(buffer, byteOffset);
		}
		this.#buffer = buffer;
		this.#byteOffset = byteOffset;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
	}

	/**
	 * @inheritdoc
	 */
	public get buffer(): ArrayBuffer {
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
	 * Data view.
	 *
	 * @returns Data view of buffer.
	 */
	public get dataView(): DataView {
		return this.#dataView ??= new DataView(this.#buffer, this.byteOffset);
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
