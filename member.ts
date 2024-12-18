/**
 * @module
 *
 * Types and functions for defining a member.
 */

import type {
	Memberable,
	MemberableClass,
	MemberableClassKeys,
	MemberInfo,
} from './members.ts';
import type { BufferView } from './native.ts';
import type { Type } from './type.ts';
import { assignView } from './util.ts';

/**
 * Get default/current/next member offset for type.
 *
 * @param Type Type class.
 * @returns Byte offset.
 */
export function defaultMemberByteOffset(Type: MemberableClass): number {
	return Type.OVERLAPPING ? 0 : Type.BYTE_LENGTH;
}

/**
 * Ensure byte length of type is defined.
 *
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
 * Member descriptor.
 */
export interface MemberDescriptor<T extends Memberable, M> {
	/**
	 * Byte length.
	 */
	byteLength: number;

	/**
	 * Byte offset.
	 */
	byteOffset?: number | null;

	/**
	 * Getter function.
	 *
	 * @param this Type instance.
	 * @returns Member value.
	 */
	get: (this: T) => M;

	/**
	 * Setter function.
	 *
	 * @param this Type instance.
	 * @param value Member value.
	 */
	set: (this: T, value: M) => void;
}

/**
 * Define member.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param desc Member descriptor.
 * @returns Updated type byte length.
 */
export function defineMember<T extends MemberableClass, M>(
	Type: T,
	name: MemberableClassKeys<T, M>,
	desc: Readonly<
		MemberDescriptor<(T['prototype'] & Record<typeof name, M>), M>
	>,
): number {
	let { byteLength, byteOffset, get, set } = desc;
	byteLength = (+byteLength || 0) - (byteLength % 1 || 0);
	byteOffset ??= defaultMemberByteOffset(Type);
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
 */
export interface MemberConstructor<
	T extends BufferView = BufferView,
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
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or inherit.
 * @returns Updated type byte length.
 */
export function member<T extends MemberableClass, M extends BufferView>(
	Member: MemberConstructor<M>,
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	let m: WeakMap<Type, M>;
	byteOffset ??= defaultMemberByteOffset(Type);
	byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
	return defineMember(Type, name, {
		byteLength: Member.BYTE_LENGTH,
		byteOffset,
		get(): M {
			let r = (m ??= new WeakMap()).get(this);
			if (!r) {
				m.set(
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
		set(value): void {
			assignView(this[name], value);
		},
	});
}

/**
 * Member: generic, big endian.
 *
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function memberBE<T extends MemberableClass, M extends BufferView>(
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
 * @param Member Member constructor.
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function memberLE<T extends MemberableClass, M extends BufferView>(
	Member: MemberConstructor<M>,
	Type: T,
	name: MemberableClassKeys<T, M>,
	byteOffset: number | null = null,
): number {
	return member(Member, Type, name, byteOffset, true);
}

/**
 * Member: pad.
 *
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
		byteOffset ??= defaultMemberByteOffset(Type);
		byteOffset = (+byteOffset || 0) - (byteOffset % 1 || 0);
		return ensureByteLength(Type, byteLength + byteOffset);
	}
	return defineMember(Type, name, {
		byteLength,
		byteOffset,
		get(): never {
			throw new TypeError(`Read from padding member: ${String(name)}`);
		},
		set(): void {
			throw new TypeError(`Write to padding member: ${String(name)}`);
		},
	});
}
