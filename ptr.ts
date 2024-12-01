import { LITTLE_ENDIAN } from './endian.ts';
import type { ArrayBufferReal, EndianBufferPointer } from './type.ts';
import { dataView } from './util.ts';

function index(key: PropertyKey): number | null {
	let n;
	return key === '-0' ? null : (key === '' + (n = +String(key)) ? n : null);
}

const getter = Symbol('getter');

const setter = Symbol('setter');

const handler: ProxyHandler<Ptr<unknown>> = {
	deleteProperty(target, key): boolean {
		let i;
		return Reflect.has(target, key) || (i = index(key)) === null
			? Reflect.deleteProperty(target, key)
			: Number.isSafeInteger(i);
	},
	get(target, key, receiver: Ptr<unknown>): unknown | undefined {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.get(target, key);
		}
		if (Number.isSafeInteger(i)) {
			return receiver[getter](i);
		}
	},
	has(target, key): boolean {
		return Reflect.has(target, key) || Number.isSafeInteger(index(key));
	},
	set(target, key, value, receiver: Ptr<unknown>): boolean {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.set(target, key, value);
		}
		if (Number.isSafeInteger(i)) {
			receiver[setter](i, value);
		}
		return true;
	},
};

/**
 * Pointer to a type.
 */
export abstract class Ptr<T> implements EndianBufferPointer {
	declare public readonly ['constructor']: Omit<typeof Ptr, 'new'>;

	/**
	 * Pointer elements.
	 */
	[index: number]: T;

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
	 * ArrayTyped constructor.
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
		if (byteOffset < 0 || byteOffset > 0x1fffffffffffff) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		this.#byteOffset = byteOffset - byteOffset % 1 || 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
		return new Proxy(this, handler as ProxyHandler<Ptr<T>>);
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
	 * Getter accessor.
	 *
	 * @returns Element value.
	 */
	protected abstract [getter](index: number): T;

	/**
	 * Setter accessor.
	 *
	 * @param value Element value.
	 */
	protected abstract [setter](index: number, value: T): void;

	/**
	 * Getter symbol.
	 */
	protected static readonly getter: typeof getter = getter;

	/**
	 * Setter symbol.
	 */
	protected static readonly setter: typeof setter = setter;

	/**
	 * Size of each element.
	 */
	public static readonly BYTES_PER_ELEMENT: number;
}
