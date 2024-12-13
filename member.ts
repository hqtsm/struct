import type {
	BufferView,
	MemberInfo,
	MembersExtends,
	Type,
	TypeClass,
} from './type.ts';
import { assignView } from './util.ts';

/**
 * Member descriptor.
 */
export interface MemberDescriptor<T extends Type, M> extends MemberInfo {
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
 * @param Type Type constructor.
 * @param name Member name.
 * @param desc Member descriptor.
 * @returns Byte length.
 */
export function defineMember<T extends Type, M>(
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	desc: Readonly<MemberDescriptor<(T & Record<typeof name, M>), M>>,
): number {
	const { byteLength, byteOffset, get, set } = desc;
	Object.defineProperty(Type.prototype, name, {
		get,
		set,
		configurable: true,
	});
	Object.defineProperty(Type.MEMBERS, name, {
		value: { byteOffset, byteLength } satisfies MemberInfo,
		configurable: true,
		writable: true,
	});
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
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function member<M extends BufferView, T extends Type>(
	Member: MemberConstructor<M>,
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	let m: WeakMap<T, M>;
	return defineMember(Type, name, {
		byteOffset,
		byteLength: Member.BYTE_LENGTH,
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
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberBE<M extends BufferView, T extends Type>(
	Member: MemberConstructor<M>,
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	byteOffset: number,
): number {
	return member(Member, Type, name, byteOffset, false);
}

/**
 * Member: generic, little endian.
 *
 * @param Member Member constructor.
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Byte length.
 */
export function memberLE<M extends BufferView, T extends Type>(
	Member: MemberConstructor<M>,
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	byteOffset: number,
): number {
	return member(Member, Type, name, byteOffset, true);
}

/**
 * Member: pad.
 *
 * @param byteLength Padding size.
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function pad<T extends Type>(
	byteLength: number,
	Type: TypeClass<T>,
	name: MembersExtends<T, unknown>,
	byteOffset: number,
): number {
	return defineMember(Type, name, {
		byteOffset,
		byteLength,
		get(): unknown {
			throw new TypeError(`Read from padding member: ${String(name)}`);
		},
		set(): void {
			throw new TypeError(`Write to padding member: ${String(name)}`);
		},
	});
}
