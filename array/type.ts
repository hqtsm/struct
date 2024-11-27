import type { ArrayBufferReal, Type, TypeConstructor } from '../type.ts';
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
	): ArrayTypeConstructor<T> {
		types ??= new WeakMap<TypeConstructor<T>, ArrayTypedConstructor<T>>();
		let r = types.get(Type);
		if (!r) {
			const name = `${ArrayType.name}<${Type.name}>`;
			types.set(
				Type,
				r = {
					[name]: class extends ArrayType<T> {
						public static override readonly Type: TypeConstructor<
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

export interface ArrayTypeClass<T extends Type = Type>
	extends Omit<typeof ArrayType<T>, 'new'> {
	readonly Type: TypeConstructor<T>;
}

export interface ArrayTypeConstructor<
	T extends Type = Type,
> extends ArrayTypeClass<T> {
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		length?: number,
		littleEndian?: boolean | null,
	): ArrayTyped<T>;
}
