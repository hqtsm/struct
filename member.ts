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
	byteOffset ??= defaultMemberByteOffset(Type);
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
	byteLength += byteOffset;
	if (byteLength > Type.BYTE_LENGTH) {
		(Type as { BYTE_LENGTH: number }).BYTE_LENGTH = byteLength;
	}
	return byteLength;
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
	 * @param littleEndian Little endian, big endian, or default.
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
 * @param littleEndian Little endian, big endian, or default.
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
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function pad<T extends MemberableClass>(
	byteLength: number,
	Type: T,
	name: MemberableClassKeys<T, unknown> | null = null,
	byteOffset: number | null = null,
): number {
	if (name === null) {
		byteLength += byteOffset ?? defaultMemberByteOffset(Type);
		if (byteLength > Type.BYTE_LENGTH) {
			(Type as { BYTE_LENGTH: number }).BYTE_LENGTH = byteLength;
		}
		return byteLength;
	}
	return defineMember(Type, name, {
		byteLength,
		byteOffset,
		get(): unknown {
			throw new TypeError(
				`Read from padding member: ${String(name)}`,
			);
		},
		set(): void {
			throw new TypeError(`Write to padding member: ${String(name)}`);
		},
	});
}
