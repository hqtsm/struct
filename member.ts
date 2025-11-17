/**
 * @module
 *
 * Types and functions for defining a member.
 */

import type {
	MemberableClass,
	MemberableClassKeys,
	MemberInfo,
} from './members.ts';
import type { Type } from './type.ts';
import { assignView } from './util.ts';

/**
 * Get next/current/default member offset for type.
 *
 * @param Type Type class.
 * @returns Byte offset.
 */
export function nextByteOffset(Type: MemberableClass): number {
	return Type.OVERLAPPING ? 0 : Type.BYTE_LENGTH;
}

/**
 * Ensure byte length of type is defined.
 *
 * @template T Type class.
 * @param Type Type class.
 * @param byteLength Byte length to ensure at-least.
 * @returns Updated type byte length.
 */
export function ensureByteLength<T extends MemberableClass>(
	Type: T,
	byteLength = 0,
): number {
	const { BYTE_LENGTH } = Type;
	const value = byteLength > BYTE_LENGTH ? byteLength : BYTE_LENGTH;
	Object.defineProperty(Type, 'BYTE_LENGTH', {
		value,
		configurable: true,
		enumerable: false,
		writable: false,
	});
	return value;
}

/**
 * Define member.
 *
 * @template T Type class.
 * @template M Member type.
 * @param Type Type class.
 * @param name Member name.
 * @param desc Member descriptor.
 * @returns Updated type byte length.
 */
export function defineMember<T extends MemberableClass, M>(
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteLength: number,
	byteOffset: number | null,
	get: (this: T['prototype'] & Record<typeof name, M>) => M,
	set: (this: T['prototype'] & Record<typeof name, M>, value: M) => void,
): number {
	byteLength = (+byteLength || 0) - (byteLength % 1 || 0);
	byteOffset ??= nextByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	Object.defineProperty(Type.prototype, name, {
		get,
		set,
		configurable: true,
		enumerable: false,
	});
	Object.defineProperty(Type.MEMBERS, name, {
		value: { byteOffset, byteLength } satisfies MemberInfo,
		configurable: true,
		enumerable: true,
		writable: false,
	});
	return ensureByteLength(Type, byteOffset + byteLength);
}

/**
 * Member constructor.
 *
 * @template T Member type.
 */
export interface MemberConstructor<
	T extends ArrayBufferView = ArrayBufferView,
> {
	/**
	 * Member constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset.
	 * @param littleEndian Little endian, big endian, or inherit.
	 */
	new (
		buffer: ArrayBufferLike,
		byteOffset: number,
		littleEndian?: boolean | null,
	): T;

	/**
	 * Byte length.
	 */
	readonly BYTE_LENGTH: number;
}

/**
 * Member: generic.
 *
 * @template T Type class.
 * @template M Member type.
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function member<T extends MemberableClass, M extends ArrayBufferView>(
	Member: MemberConstructor<M>,
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	const members = new WeakMap<Type, M>();
	byteOffset ??= nextByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(
		Type,
		name,
		Member.BYTE_LENGTH,
		byteOffset,
		function (): M {
			let r = members.get(this);
			if (!r) {
				members.set(
					this,
					r = new Member(
						this.buffer,
						this.byteOffset + byteOffset,
						littleEndian ?? this.littleEndian,
					),
				);
			}
			return r;
		},
		function (value): void {
			assignView(this[name], value);
		},
	);
}

/**
 * Member: generic, big endian.
 *
 * @template T Type class.
 * @template M Member type.
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function memberBE<T extends MemberableClass, M extends ArrayBufferView>(
	Member: MemberConstructor<M>,
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteOffset: number | null = null,
): number {
	return member(Member, Type, name, byteOffset, false);
}

/**
 * Member: generic, little endian.
 *
 * @template T Type class.
 * @template M Member type.
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function memberLE<T extends MemberableClass, M extends ArrayBufferView>(
	Member: MemberConstructor<M>,
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteOffset: number | null = null,
): number {
	return member(Member, Type, name, byteOffset, true);
}

function padRead(name: PropertyKey): never {
	throw new TypeError(`Read from padding member: ${String(name)}`);
}

function padWrite(name: PropertyKey): never {
	throw new TypeError(`Write to padding member: ${String(name)}`);
}

/**
 * Member: pad.
 *
 * @template T Type class.
 * @param byteLength Padding size.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function pad<T extends MemberableClass>(
	byteLength: number,
	Type: T,
	name: MemberableClassKeys<T, never> | null = null,
	byteOffset: number | null = null,
): number {
	if (name === null) {
		byteLength = (+byteLength || 0) - (byteLength % 1 || 0);
		byteOffset ??= nextByteOffset(Type);
		byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
		return ensureByteLength(Type, byteLength + byteOffset);
	}
	return defineMember(
		Type,
		name,
		byteLength,
		byteOffset,
		padRead.bind(null, name),
		padWrite.bind(null, name),
	);
}
