/**
 * @module
 *
 * Endian related constants, types, and factories.
 */

import type { ArrayBufferReal, BufferPointer } from './native.ts';
import { constant, dataView } from './util.ts';

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
let dynamicEndians: WeakMap<EndianClass, EndianClass>;
let bigEndians: WeakMap<EndianClass, EndianClass>;
let littleEndians: WeakMap<EndianClass, EndianClass>;

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
 * Endian aware buffer pointer.
 */
export class Endian implements BufferPointer, EndianAware {
	/**
	 * Endian class.
	 */
	declare public readonly ['constructor']: EndianClass;

	/**
	 * Type tag.
	 */
	declare public readonly [Symbol.toStringTag]: string;

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
		byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
		if (!(byteOffset > -Infinity && byteOffset < Infinity)) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		(pri ??= new WeakMap()).set(this, {
			buffer,
			byteOffset,
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

	static {
		constant(this.prototype, Symbol.toStringTag, 'Endian');
		constant(this, 'LITTLE_ENDIAN');
	}
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
		littleEndian?: boolean | null,
	): Endian;
}

/**
 * Extend endian class as default endian.
 *
 * @template T Endian class.
 * @param Endian Endian class.
 * @returns Extended class.
 */
export function dynamicEndian<T extends EndianClass>(
	// deno-lint-ignore ban-types
	Endian: T & Function,
): T {
	let r = (dynamicEndians ??= new WeakMap()).get(Endian);
	if (!r) {
		const name = `DynamicEndian<${Endian.name}>`;
		dynamicEndians.set(
			Endian,
			r = {
				[name]: class extends (Endian as unknown as EndianConstructor) {
					public static override readonly LITTLE_ENDIAN = null;

					static {
						constant(
							this.prototype,
							Symbol.toStringTag,
							`DynamicEndian<${
								Endian.prototype[Symbol.toStringTag]
							}>`,
						);
						constant(this, 'LITTLE_ENDIAN');
					}
				},
			}[name],
		);
	}
	return r as T;
}

/**
 * Extend endian class as big endian.
 *
 * @template T Endian class.
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

					static {
						constant(
							this.prototype,
							Symbol.toStringTag,
							`BigEndian<${
								Endian.prototype[Symbol.toStringTag]
							}>`,
						);
						constant(this, 'LITTLE_ENDIAN');
					}
				},
			}[name],
		);
	}
	return r as T;
}

/**
 * Extend endian class as little endian.
 *
 * @template T Endian class.
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

					static {
						constant(
							this.prototype,
							Symbol.toStringTag,
							`LittleEndian<${
								Endian.prototype[Symbol.toStringTag]
							}>`,
						);
						constant(this, 'LITTLE_ENDIAN');
					}
				},
			}[name],
		);
	}
	return r as T;
}
