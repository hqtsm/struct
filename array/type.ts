import type { ArrayBufferReal, Type, TypeConstructor } from '../type.ts';
import { assignType } from '../util.ts';
import { ArrayTyped, type ArrayTypedConstructor } from './typed.ts';

let types: WeakMap<TypeConstructor, ArrayTypedConstructor>;

/**
 * ArrayType interface.
 */
export abstract class ArrayType<T extends Type = Type> extends ArrayTyped<T> {
	/**
	 * ArrayType class.
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayType<T>, 'new'>;

	/**
	 * Instances mapped over indexes.
	 */
	#values = new Map<number, T>();

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.getter](index: number): T {
		const values = this.#values;
		let r = values.get(index);
		if (!r) {
			values.set(
				index,
				r = new this.constructor.TYPE(
					this.buffer,
					this.byteOffset +
						index * this.constructor.BYTES_PER_ELEMENT,
					this.littleEndian,
				) as T,
			);
		}
		return r;
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: T): void {
		const values = this.#values;
		let r = values.get(index);
		if (!r) {
			values.set(
				index,
				r = new this.constructor.TYPE(
					this.buffer,
					this.byteOffset +
						index * this.constructor.BYTES_PER_ELEMENT,
					this.littleEndian,
				) as T,
			);
		}
		assignType(r, value);
	}

	/**
	 * Type constructor.
	 */
	public static readonly TYPE: TypeConstructor;

	/**
	 * Get the ArrayType of Type constructor.
	 *
	 * @param Type Type constructor.
	 * @returns ArrayType constructor.
	 */
	public static of<T extends Type>(
		Type: TypeConstructor<T>,
	): ArrayTypeConstructor<T> {
		let r = (types ??= new WeakMap()).get(Type) as
			| ArrayTypeConstructor<T>
			| undefined;
		if (!r) {
			const name = `${ArrayType.name}<${Type.name}>`;
			types.set(
				Type,
				r = {
					[name]: class extends ArrayType<T> {
						public static override readonly TYPE: TypeConstructor<
							T
						> = Type;

						public static override readonly BYTES_PER_ELEMENT:
							number = Type.BYTE_LENGTH;
					},
				}[name],
			);
		}
		return r;
	}
}

/**
 * ArrayType class.
 */
export interface ArrayTypeClass<
	T extends Type = Type,
> extends Omit<typeof ArrayType<T>, 'new'> {
	/**
	 * @inheritdoc
	 */
	readonly TYPE: TypeConstructor<T>;
}

/**
 * ArrayType constructor.
 */
export interface ArrayTypeConstructor<
	T extends Type = Type,
> extends ArrayTypeClass<T> {
	/**
	 * ArrayType constructor.
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
