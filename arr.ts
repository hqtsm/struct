import type { Ptr, PtrClass } from './ptr.ts';
import type { ArrayBufferReal, Type, TypeClass } from './type.ts';

/**
 * Array.
 */
export interface Arr<T = never> extends Ptr<T>, Type {
	/**
	 * Ptr Type constructor.
	 */
	readonly constructor: PtrClass<T> & TypeClass;
}

/**
 * Array class.
 */
export interface ArrClass<T = never> extends PtrClass<T>, TypeClass {
	/**
	 * Ptr Type prototype.
	 */
	readonly prototype: Arr<T>;
}

/**
 * Array constructor.
 */
export interface ArrConstructor<T = never> extends ArrClass<T> {
	/**
	 * Ptr Type constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		littleEndian?: boolean,
	): Arr<T>;
}
