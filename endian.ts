/**
 * @module
 *
 * Endian related constants, types, and factories.
 */

import { type Abstract, type Class, constant, toStringTag } from '@hqtsm/class';
import { dataView } from './util.ts';

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

const buffers = new WeakMap<Endian, ArrayBufferLike>();
const byteOffsets = new WeakMap<Endian, number>();
const littleEndians = new WeakMap<Endian, boolean>();
const dynamicEndianClass = new WeakMap<EndianClass, EndianClass>();
const bigEndianClass = new WeakMap<EndianClass, EndianClass>();
const littleEndianClass = new WeakMap<EndianClass, EndianClass>();

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
export class Endian
	implements Omit<ArrayBufferView, 'byteLength'>, EndianAware {
	/**
	 * Endian class.
	 */
	declare public readonly ['constructor']: Class<typeof Endian>;

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
		buffer: ArrayBufferLike,
		byteOffset?: number,
		littleEndian?: boolean | null,
	) {
		dataView(buffer);
		byteOffset = (+byteOffset! || 0) - (byteOffset! % 1 || 0);
		if (!(byteOffset > -Infinity && byteOffset < Infinity)) {
			throw new RangeError(`Invalid offset: ${byteOffset}`);
		}
		buffers.set(this, buffer);
		byteOffsets.set(this, byteOffset);
		littleEndians.set(this, !!(littleEndian ?? LITTLE_ENDIAN));
	}

	public get buffer(): ArrayBufferLike {
		return buffers.get(this)!;
	}

	public get byteOffset(): number {
		return byteOffsets.get(this)!;
	}

	public get littleEndian(): boolean {
		return this.constructor.LITTLE_ENDIAN ?? littleEndians.get(this)!;
	}

	/**
	 * Type level endian override.
	 */
	public static readonly LITTLE_ENDIAN: boolean | null = null;

	static {
		toStringTag(this, 'Endian');
		constant(this, 'LITTLE_ENDIAN');
	}
}

/**
 * Endian constructor.
 */
export type EndianConstructor = typeof Endian;

/**
 * Endian class.
 */
export type EndianClass = Class<EndianConstructor>;

/**
 * Extend endian class as default endian.
 *
 * @template T Endian class.
 * @param Endian Endian class.
 * @returns Extended class.
 */
export function dynamicEndian<T extends EndianClass>(Endian: T): T {
	let r = dynamicEndianClass.get(Endian);
	if (!r) {
		const name = `DynamicEndian<${Endian.name}>`;
		const tag = `DynamicEndian<${Endian.prototype[Symbol.toStringTag]}>`;
		dynamicEndianClass.set(
			Endian,
			r = {
				[name]: class extends (Endian as Abstract<EndianConstructor>) {
					public static override readonly LITTLE_ENDIAN = null;

					static {
						toStringTag(this, tag);
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
export function bigEndian<T extends EndianClass>(Endian: T): T {
	let r = bigEndianClass.get(Endian);
	if (!r) {
		const name = `BigEndian<${Endian.name}>`;
		const tag = `BigEndian<${Endian.prototype[Symbol.toStringTag]}>`;
		bigEndianClass.set(
			Endian,
			r = {
				[name]: class extends (Endian as Abstract<EndianConstructor>) {
					public static override readonly LITTLE_ENDIAN = false;

					static {
						toStringTag(this, tag);
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
export function littleEndian<T extends EndianClass>(Endian: T): T {
	let r = littleEndianClass.get(Endian);
	if (!r) {
		const name = `LittleEndian<${Endian.name}>`;
		const tag = `LittleEndian<${Endian.prototype[Symbol.toStringTag]}>`;
		littleEndianClass.set(
			Endian,
			r = {
				[name]: class extends (Endian as Abstract<EndianConstructor>) {
					public static override readonly LITTLE_ENDIAN = true;

					static {
						toStringTag(this, tag);
						constant(this, 'LITTLE_ENDIAN');
					}
				},
			}[name],
		);
	}
	return r as T;
}
