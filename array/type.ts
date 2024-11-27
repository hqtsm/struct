import type { Type, TypeConstructor } from '../type.ts';
import { assignType } from '../util.ts';
import { ArrayTyped, type ArrayTypedConstructor } from './typed.ts';

// deno-lint-ignore no-explicit-any
function set<T>(m: { set: (k: any, v: T) => void }, k: any, v: T): T {
	m.set(k, v);
	return v;
}

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
		return values.get(index) ?? set(
			values,
			index,
			new this.constructor.Type(
				this.buffer,
				this.byteOffset + index * this.bytesPerElement,
				this.littleEndian,
			) as T,
		);
	}

	/**
	 * @inheritdoc
	 */
	protected override [ArrayTyped.setter](index: number, value: T): void {
		const values = this.#values;
		assignType(
			values.get(index) ?? set(
				values,
				index,
				new this.constructor.Type(
					this.buffer,
					this.byteOffset + index * this.bytesPerElement,
					this.littleEndian,
				) as T,
			),
			value,
		);
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
		return types.get(Type) ?? set(
			types,
			Type,
			class extends ArrayType<T> {
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
				public static override readonly BYTES_PER_ELEMENT: number =
					Type.BYTE_LENGTH;
			},
		);
	}
}
