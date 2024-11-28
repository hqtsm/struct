import { LITTLE_ENDIAN } from '../endian.ts';
import type { ArrayBufferReal, EndianBufferView, Type } from '../type.ts';
import { dataView } from '../util.ts';

function index(key: PropertyKey): number | null {
	let i;
	return key === '-0' ? NaN : (
		key === '' + (i = +String(key))
			? (i >= 0 && i === (i - i % 1) ? i : NaN)
			: null
	);
}

const getter = Symbol('getter');

const setter = Symbol('setter');

let handler: ProxyHandler<ArrayTyped<unknown>>;

/**
 * ArrayTyped interface.
 */
export abstract class ArrayTyped<T> implements EndianBufferView {
	/**
	 * ArrayTyped class.
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayTyped, 'new'>;

	/**
	 * Array elements.
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
		if (byteOffset < 0 || byteOffset > 0x1fffffffffffff) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		if (length < 0 || length > 0x1fffffffffffff) {
			throw new RangeError(`Invalid length: ${length}`);
		}
		this.#byteOffset = byteOffset - byteOffset % 1 || 0;
		this.#length = length - length % 1 || 0;
		this.#littleEndian = !!(littleEndian ?? LITTLE_ENDIAN);
		return new Proxy(this, handler as ProxyHandler<ArrayTyped<T>>);
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
		return this.length * this.constructor.BYTES_PER_ELEMENT;
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
	 * Size of each array element.
	 */
	public static readonly BYTES_PER_ELEMENT: number = void (handler = {
		deleteProperty(target, key): boolean {
			let i;
			return Reflect.has(target, key) || (i = index(key)) === null
				? Reflect.deleteProperty(target, key)
				: !(i < target.#length);
		},
		get(target, key, receiver: ArrayTyped<unknown>): unknown | undefined {
			let i;
			if (Reflect.has(target, key) || (i = index(key)) === null) {
				return Reflect.get(target, key);
			}
			if (i < target.#length) {
				return receiver[getter](i);
			}
		},
		has(target, key): boolean {
			return (
				Reflect.has(target, key) ||
				(index(key) ?? NaN) < target.#length
			);
		},
		set(target, key, value, receiver: ArrayTyped<unknown>): boolean {
			let i;
			if (Reflect.has(target, key) || (i = index(key)) === null) {
				return Reflect.set(target, key, value);
			}
			if (i < target.#length) {
				receiver[setter](i, value);
			}
			return true;
		},
	}) as unknown as number;
}

/**
 * ArrayTyped class.
 */
export interface ArrayTypedClass<
	T extends Type = Type,
> extends Omit<typeof ArrayTyped<T>, 'new'> {}

/**
 * ArrayTyped constructor.
 */
export interface ArrayTypedConstructor<
	T extends Type = Type,
> extends ArrayTypedClass<T> {
	/**
	 * ArrayTyped constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param length Array length (element count).
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		length?: number,
		littleEndian?: boolean | null,
	): ArrayTyped<T>;
}
