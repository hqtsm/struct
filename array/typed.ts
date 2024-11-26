import { LITTLE_ENDIAN } from '../endian.ts';
import type { ArrayBufferReal, EndianBufferView } from '../type.ts';
import { dataView } from '../util.ts';

function parseIndex(key: PropertyKey): number | null {
	let index;
	return key === '-0'
		? NaN
		: ((key === '' + (index = +String(key)))
			? (index === (index | 0) && index >= 0 ? index : NaN)
			: null);
}

const getter = Symbol('getter');

const setter = Symbol('setter');

function createHandler<E>(
	length: (a: ArrayTyped<unknown>) => number,
): ProxyHandler<ArrayTyped<E>> {
	return {
		deleteProperty(target, key): boolean {
			let i;
			return (Reflect.has(target, key) || (i = parseIndex(key)) === null)
				? Reflect.deleteProperty(target, key)
				: !(i < length(target));
		},
		get(target, key, receiver: ArrayTyped<E>): E | undefined {
			let i;
			if (Reflect.has(target, key) || (i = parseIndex(key)) === null) {
				return Reflect.get(target, key);
			}
			if (i < length(target)) {
				return receiver[getter](i);
			}
		},
		has(target, key): boolean {
			return (
				Reflect.has(target, key) ||
				(parseIndex(key) ?? NaN) < length(target)
			);
		},
		set(target, key, value, receiver: ArrayTyped<E>): boolean {
			let i;
			if (Reflect.has(target, key) || (i = parseIndex(key)) === null) {
				return Reflect.set(target, key, value);
			}
			if (i < length(target)) {
				receiver[setter](i, value);
			}
			return true;
		},
	};
}

let handler;

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
		this.#length = length |= 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
		return new Proxy(
			this,
			handler ??= createHandler<E>((a: ArrayTyped<unknown>) => a.#length),
		);
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
	protected abstract [setter](index: number, value: unknown): void;

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
