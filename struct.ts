import { LITTLE_ENDIAN } from './endian.ts';
import type { ArrayBufferReal } from './type.ts';
import { dataView } from './util.ts';

/**
 * Possible members of a struct.
 */
export type Members<S extends Struct> = Exclude<keyof S, keyof Struct>;

/**
 * Possible members of a struct that member type extends.
 */
export type MembersExtends<S extends Struct, M> = Exclude<
	{ [K in keyof S]: M extends S[K] ? K : never }[keyof S],
	keyof Struct
>;

/**
 * Types of member type.
 */
export type MemberInfoType =
	// deno-lint-ignore ban-types
	| Function
	| null;

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

/**
 * Struct member info properties.
 */
export type Membered = {
	/**
	 * Struct prototype.
	 */
	readonly prototype: typeof Struct['prototype'];

	/**
	 * Struct members.
	 */
	readonly MEMBERS: Readonly<MemberInfos>;
};

/**
 * Binary structure buffer view.
 */
export class Struct implements ArrayBufferView {
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
		if ((this.#byteOffset = byteOffset | 0) < 0) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
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
