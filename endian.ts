import type { ArrayBufferReal, BufferPointer } from './type.ts';
import { dataView } from './util.ts';

/**
 * Endian aware.
 */
export interface EndianAware {
	/**
	 * True for little endian, false for big endian.
	 */
	readonly littleEndian: boolean;
}

/**
 * Is host big endian.
 */
export const BIG_ENDIAN: boolean = !new Uint8Array(
	new Uint16Array([1]).buffer,
)[0];

/**
 * Is host little endian.
 */
export const LITTLE_ENDIAN = !BIG_ENDIAN;

let pri: WeakMap<Endian, BufferPointer & EndianAware>;

/**
 * Endian aware buffer pointer.
 */
export class Endian implements BufferPointer, EndianAware {
	/**
	 * Endian class.
	 */
	declare public readonly ['constructor']: EndianClass;

	/**
	 * Create instance for buffer.
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
		dataView(buffer);
		if (byteOffset < -0x1fffffffffffff || byteOffset > 0x1fffffffffffff) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		(pri ??= new WeakMap()).set(this, {
			buffer,
			byteOffset: byteOffset - byteOffset % 1 || 0,
			littleEndian: !!(littleEndian ?? LITTLE_ENDIAN),
		});
	}

	public get buffer(): ArrayBufferLike {
		return pri.get(this)!.buffer;
	}

	public get byteOffset(): number {
		return pri.get(this)!.byteOffset;
	}

	public get littleEndian(): boolean {
		return this.constructor.LITTLE_ENDIAN ?? pri.get(this)!.littleEndian;
	}

	/**
	 * Type level endian override.
	 */
	public static readonly LITTLE_ENDIAN: boolean | null = null;
}

/**
 * Endian class.
 */
export interface EndianClass extends Omit<typeof Endian, 'new'> {}

/**
 * Endian constructor.
 */
export interface EndianConstructor extends EndianClass {
	/**
	 * Endian constructor.
	 */
	new (
		buffer: ArrayBufferReal,
		byteOffset?: number,
		littleEndian?: boolean,
	): Endian;
}

let defaultEndians: WeakMap<EndianClass, EndianClass>;

/**
 * Extend endian class as default endian.
 *
 * @param Endian Endian class.
 * @returns Extended class.
 */
export function defaultEndian<T extends EndianClass>(
	// deno-lint-ignore ban-types
	Endian: T & Function,
): T {
	let r = (defaultEndians ??= new WeakMap()).get(Endian);
	if (!r) {
		const name = `defaultEndian<${Endian.name}>`;
		defaultEndians.set(
			Endian,
			r = {
				[name]: class extends (Endian as unknown as EndianConstructor) {
					public static override readonly LITTLE_ENDIAN = null;
				},
			}[name],
		);
	}
	return r as T;
}

let bigEndians: WeakMap<EndianClass, EndianClass>;

/**
 * Extend endian class as big endian.
 *
 * @param Endian Endian class.
 * @returns Extended class.
 */
export function bigEndian<T extends EndianClass>(
	// deno-lint-ignore ban-types
	Endian: T & Function,
): T {
	let r = (bigEndians ??= new WeakMap()).get(Endian);
	if (!r) {
		const name = `BigEndian<${Endian.name}>`;
		bigEndians.set(
			Endian,
			r = {
				[name]: class extends (Endian as unknown as EndianConstructor) {
					public static override readonly LITTLE_ENDIAN = false;
				},
			}[name],
		);
	}
	return r as T;
}

let littleEndians: WeakMap<EndianClass, EndianClass>;

/**
 * Extend endian class as little endian.
 *
 * @param Endian Endian class.
 * @returns Extended class.
 */
export function littleEndian<T extends EndianClass>(
	// deno-lint-ignore ban-types
	Endian: T & Function,
): T {
	let r = (littleEndians ??= new WeakMap()).get(Endian);
	if (!r) {
		const name = `LittleEndian<${Endian.name}>`;
		littleEndians.set(
			Endian,
			r = {
				[name]: class extends (Endian as unknown as EndianConstructor) {
					public static override readonly LITTLE_ENDIAN = true;
				},
			}[name],
		);
	}
	return r as T;
}
