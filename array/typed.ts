import { LITTLE_ENDIAN } from '../endian.ts';
import type { ArrayBufferReal, EndianBufferView } from '../type.ts';
import { dataView } from '../util.ts';

function parseIndex(key: PropertyKey): number | null {
	let index;
	return (key === '-0')
		? NaN
		: ((key === '' + (index = +String(key)))
			? (index === (index | 0) && index >= 0 ? index : NaN)
			: null);
}

const handler: ProxyHandler<ArrayTyped<unknown>> = {
	has(target, key): boolean {
		const index = parseIndex(key);
		return index === null ? key in target : index < target.length;
	},
	get(target, key): unknown | undefined {
		const index = parseIndex(key);
		if (index !== null) {
			if (index < target.length) {
				return target[getter](index);
			}
			return;
		}
		return (target as unknown as Record<typeof key, unknown>)[key];
	},
	set(target, key, value): boolean {
		const index = parseIndex(key);
		if (index !== null) {
			if (index < target.length) {
				target[setter](index, value);
			}
			return true;
		}
		(target as unknown as Record<typeof key, unknown>)[key] = value;
		return true;
	},
};

const getter = Symbol('getter');

const setter = Symbol('setter');

/**
 * ArrayTyped interface.
 */
export abstract class ArrayTyped<E> implements EndianBufferView {
	/**
	 * ArrayType class.
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayTyped, 'new'>;

	/**
	 * Array elements.
	 */
	[index: number]: E;

	/**
	 * Buffer data.
	 */
	readonly #buffer: ArrayBufferLike;

	/**
	 * Byte offset into buffer.
	 */
	readonly #byteOffset: number;

	/**
	 * Array length (element count).
	 */
	readonly #length: number;

	/**
	 * Little endian, or big.
	 */
	readonly #littleEndian: boolean;

	/**
	 * ArrayTyped constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param length Array length (element count).
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		length = 0,
		littleEndian: boolean | null = null,
	) {
		dataView(this.#buffer = buffer);
		if (byteOffset < 0) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		if (length < 0) {
			throw new RangeError(`Invalid length: ${length}`);
		}
		this.#byteOffset = byteOffset | 0;
		this.#length = length | 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
		return new Proxy(this, handler as ProxyHandler<ArrayTyped<E>>);
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
		return this.length * this.bytesPerElement;
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
	 * Get array length (element count).
	 *
	 * @returns Array length.
	 */
	public get length(): number {
		return this.#length;
	}

	/**
	 * Get bytes per element.
	 *
	 * @returns Bytes length for element.
	 */
	public get bytesPerElement(): number {
		return this.constructor.BYTES_PER_ELEMENT;
	}

	/**
	 * Getter accessor.
	 *
	 * @returns Element value.
	 */
	protected abstract [getter](index: number): E;

	/**
	 * Setter accessor.
	 *
	 * @param value Element value.
	 */
	protected abstract [setter](index: number, value: E): void;

	/**
	 * Getter symbol.
	 */
	protected static readonly getter: typeof getter = getter;

	/**
	 * Setter symbol.
	 */
	protected static readonly setter: typeof setter = setter;

	/**
	 * Size of each array element.
	 */
	public static readonly BYTES_PER_ELEMENT: number;
}
