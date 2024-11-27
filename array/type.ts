import type { Type, TypeConstructor } from '../type.ts';
import { assignType } from '../util.ts';
import { ArrayTyped, type ArrayTypedConstructor } from './typed.ts';

let types;

/**
 * Array: Type.
 */
export abstract class ArrayType<T extends Type = Type> extends ArrayTyped<T> {
	/**
	 * ArrayType class.
	 */
	declare public readonly ['constructor']: Omit<typeof ArrayType, 'new'>;

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
				r = new this.constructor.Type(
					this.buffer,
					this.byteOffset + index * this.bytesPerElement,
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
				r = new this.constructor.Type(
					this.buffer,
					this.byteOffset + index * this.bytesPerElement,
					this.littleEndian,
				) as T,
			);
		}
		assignType(r, value);
	}

	/**
	 * Type constructor.
	 */
	public static readonly Type: TypeConstructor;

	/**
	 * Get the ArrayType of Type constructor.
	 *
	 * @param Type Type constructor.
	 * @returns ArrayType constructor.
	 */
	public static of<T extends Type>(
		Type: TypeConstructor<T>,
	): ArrayTypedConstructor<T> {
		types ??= new WeakMap<TypeConstructor<T>, ArrayTypedConstructor<T>>();
		let r = types.get(Type);
		if (!r) {
			const name = `${ArrayType.name}<${Type.name}>`;
			types.set(
				Type,
				r = {
					[name]: class extends ArrayType<T> {
						/**
						 * @inheritdoc
						 */
						declare public readonly ['constructor']: Omit<
							typeof ArrayType<T>,
							'new'
						>;

						/**
						 * @inheritdoc
						 */
						public static override readonly Type = Type;

						/**
						 * @inheritdoc
						 */
						public static override readonly BYTES_PER_ELEMENT:
							number = Type.BYTE_LENGTH;
					},
				}[name],
			);
		}
		return r;
	}
}
