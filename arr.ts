import {
	pointer,
	type Ptr,
	type PtrClass,
	type PtrConstructor,
} from './ptr.ts';
import type {
	ArrayBufferReal,
	MemberInfos,
	Type,
	TypeClass,
	TypeConstructor,
} from './type.ts';

/**
 * Array.
 */
export interface Arr<T = never> extends Ptr<T>, Type {
	/**
	 * Array constructor.
	 */
	readonly constructor: PtrClass<T> & TypeClass;
}

/**
 * Array class.
 */
export interface ArrClass<T = never> extends PtrClass<T>, TypeClass {
	/**
	 * Array prototype.
	 */
	readonly prototype: Arr<T>;
}

/**
 * Array constructor.
 */
export interface ArrConstructor<T = never> extends ArrClass<T> {
	/**
	 * Array constructor.
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

/**
 * Create array of length from type/array or pointer.
 *
 * @param Type Type or pointer constructor.
 * @param length Array length.
 * @returns Array constructor.
 */
export function array<T extends Type>(
	Type: TypeConstructor<T>,
	length: number,
): ArrConstructor<T>;
export function array<T>(
	Ptr: PtrConstructor<T> & { BYTE_LENGTH?: never },
	length: number,
): ArrConstructor<T>;
export function array<T extends Type>(
	TypePtr: TypeConstructor<T> | PtrConstructor<T>,
	length: number,
): ArrConstructor<T> {
	if (length < 0 || length > 0x1fffffffffffff) {
		throw new RangeError(`Invalid length: ${length}`);
	}
	length = length - length % 1 || 0;
	const Ptr = 'BYTE_LENGTH' in TypePtr ? pointer(TypePtr) : TypePtr;
	const name = `${Ptr.name}[${length}]`;
	let members: WeakMap<ArrConstructor, MemberInfos>;
	return {
		[name]: class extends Ptr implements Arr<T> {
			/**
			 * Array constructor.
			 */
			declare public readonly ['constructor']: ArrClass<T>;

			public get byteLength(): number {
				return this.constructor.BYTE_LENGTH;
			}

			/**
			 * Byte length of struct.
			 */
			public static readonly BYTE_LENGTH = Ptr.BYTES_PER_ELEMENT * length;

			public static override get MEMBERS(): Readonly<MemberInfos> {
				let r = (members ??= new WeakMap()).get(this as ArrConstructor);
				if (!r) {
					members.set(
						this as ArrConstructor,
						r = Object.create(
							Object.getPrototypeOf(this).MEMBERS ?? null,
						) as Readonly<MemberInfos>,
					);
				}
				return r;
			}
		},
	}[name];
}
