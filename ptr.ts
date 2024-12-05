import { LITTLE_ENDIAN } from './endian.ts';
import type {
	ArrayBufferReal,
	EndianBufferPointer,
	MemberInfo,
	MemberInfos,
	Type,
	TypeConstructor,
} from './type.ts';
import { assignType, dataView } from './util.ts';

function index(key: PropertyKey): number | null {
	let i;
	return key === '-0' ? NaN : (key === '' + (i = +String(key)) ? i : null);
}

const getter = Symbol('getter');

const setter = Symbol('setter');

const handler: ProxyHandler<Ptr<unknown>> = {
	deleteProperty(target, key): boolean {
		let i;
		return Reflect.has(target, key) || (i = index(key)) === null
			? Reflect.deleteProperty(target, key)
			: !(i === i - i % 1);
	},
	get(target, key, receiver: Ptr<unknown>): unknown | undefined {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.get(target, key);
		}
		if ((i === i - i % 1)) {
			return receiver[getter](i);
		}
	},
	has(target, key): boolean {
		let i;
		return (
			Reflect.has(target, key) ||
			((i = index(key)) !== null && i === i - i % 1)
		);
	},
	set(target, key, value, receiver: Ptr<unknown>): boolean {
		let i;
		if (Reflect.has(target, key) || (i = index(key)) === null) {
			return Reflect.set(target, key, value);
		}
		if (i === i - i % 1) {
			receiver[setter](i, value);
		}
		return true;
	},
};

let members: WeakMap<typeof Ptr, Readonly<MemberInfos>>;

/**
 * Pointer to a type.
 */
export class Ptr<T = never> implements EndianBufferPointer {
	/**
	 * Ptr class.
	 */
	declare public readonly ['constructor']: PtrClass<T>;

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
		if (byteOffset < -0x1fffffffffffff || byteOffset > 0x1fffffffffffff) {
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
	 * @param index Pointer index.
	 * @returns Pointer value.
	 */
	protected [getter](index: number): T {
		throw new TypeError(`Read from void pointer: ${index}`);
	}

	/**
	 * Setter accessor.
	 *
	 * @param index Pointer index.
	 * @param value Pointer value.
	 */
	protected [setter](index: number, value: T): void {
		void value;
		throw new TypeError(`Write to void pointer: ${index}`);
	}

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
	public static readonly BYTES_PER_ELEMENT: number = 0;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): Readonly<MemberInfos> {
		let r = (members ??= new WeakMap()).get(this);
		if (!r) {
			const bpe = this.BYTES_PER_ELEMENT;
			members.set(
				this,
				r = new Proxy(
					Object.create(
						Object.getPrototypeOf(this).MEMBERS ?? null,
					) as Readonly<MemberInfos>,
					{
						get(target, key): Readonly<MemberInfo> | undefined {
							const i = index(key);
							if (i === null) {
								return Reflect.get(target, key);
							}
							if (i === i - i % 1) {
								return {
									byteOffset: i * bpe,
									byteLength: bpe,
								};
							}
						},
						set(target, key, value): boolean {
							return index(key) === null
								? Reflect.set(target, key, value)
								: false;
						},
					},
				),
			);
			members.set(this, r);
		}
		return r;
	}
}

/**
 * Pointer class.
 */
export interface PtrClass<T = never> extends Omit<typeof Ptr<T>, 'new'> {
	/**
	 * Ptr prototype.
	 */
	readonly prototype: Ptr<T>;
}

/**
 * Pointer constructor.
 */
export interface PtrConstructor<T = never> extends PtrClass<T> {
	/**
	 * Ptr constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		littleEndian?: boolean,
	): Ptr<T>;
}

let pointers: WeakMap<TypeConstructor<Type>, PtrConstructor<Type>>;

/**
 * Get Pointer of Type.
 *
 * @param Type Type constructor.
 * @returns Ptr constructor.
 */
export function pointer<T extends Type>(
	Type: TypeConstructor<T>,
): PtrConstructor<T> {
	let r = (pointers ??= new WeakMap()).get(Type) as
		| PtrConstructor<T>
		| undefined;
	if (!r) {
		const name = `${Ptr.name}<${Type.name}>`;
		const bpe = Type.BYTE_LENGTH;
		pointers.set(
			Type,
			r = {
				[name]: class extends Ptr<T> {
					/**
					 * @inheritdoc
					 */
					declare public readonly ['constructor']: PtrClass<T>;

					/**
					 * Instances mapped over indexes.
					 */
					#values = new Map<number, T>();

					/**
					 * @inheritdoc
					 */
					public override [getter](index: number): T {
						const values = this.#values;
						let r = values.get(index);
						if (!r) {
							values.set(
								index,
								r = new Type(
									this.buffer,
									this.byteOffset + index * bpe,
									this.littleEndian,
								),
							);
						}
						return r;
					}

					/**
					 * @inheritdoc
					 */
					public override [setter](index: number, value: T): void {
						const values = this.#values;
						let r = values.get(index);
						if (!r) {
							values.set(
								index,
								r = new Type(
									this.buffer,
									this.byteOffset + index * bpe,
									this.littleEndian,
								),
							);
						}
						assignType(r, value);
					}

					/**
					 * @inheritdoc
					 */
					public static override readonly BYTES_PER_ELEMENT = bpe;
				},
			}[name],
		);
	}
	return r;
}
