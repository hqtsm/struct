import type {
	MemberInfo,
	MemberInfos,
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
	desc: MemberDescriptor<(T & Record<typeof name, M>), M>,
): number {
	const { byteLength } = desc;
	Object.defineProperty(Type.prototype, name, {
		configurable: true,
		enumerable: false,
		get: desc.get,
		set: desc.set,
	});
	(
		Object.hasOwn(Type, 'MEMBERS' satisfies keyof typeof Type)
			? (Type.MEMBERS satisfies MemberInfos)
			: ((Type as { MEMBERS: MemberInfos }).MEMBERS) = Object
				.create(Type.MEMBERS)
	)[name] = {
		byteOffset: desc.byteOffset,
		byteLength,
		littleEndian: desc.littleEndian,
		kind: desc.kind,
		signed: desc.signed,
		Type: desc.Type,
	} satisfies MemberInfo;
	return byteLength;
}

/**
 * Member constructor.
 */
export interface MemberConstructor<
	T extends ArrayBufferView = ArrayBufferView,
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
 * For MemberConstructor compatible types.
 *
 * @param Member Member constructor.
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function member<M extends ArrayBufferView, T extends Type>(
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
		littleEndian,
		kind: 'member',
		signed: null,
		Type: Member,
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
 * Array constructor.
 */
export interface ArrayConstructor<T extends ArrayBufferView = ArrayBufferView> {
	/**
	 * Array constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset.
	 * @param length Array length.
	 * @param littleEndian Little endian, big endian, or default.
	 */
	new (
		buffer: ArrayBufferLike,
		byteOffset: number,
		length: number,
		littleEndian?: boolean | null,
	): T;

	/**
	 * Bytes length for each element.
	 */
	readonly BYTES_PER_ELEMENT: number;
}

/**
 * Member: array.
 * For ArrayConstructor compatible types.
 *
 * @param Member Array constructor.
 * @param length Array length (element count).
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function array<M extends ArrayBufferView, T extends Type>(
	Member: ArrayConstructor<M>,
	length: number,
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	let m: WeakMap<T, M>;
	return defineMember(Type, name, {
		byteOffset,
		byteLength: length * Member.BYTES_PER_ELEMENT,
		littleEndian,
		kind: 'array',
		signed: null,
		Type: Member,
		get(): M {
			let r = (m ??= new WeakMap()).get(this);
			if (!r) {
				m.set(
					this,
					r = new Member(
						this.buffer,
						this.byteOffset + byteOffset,
						length,
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
 * View constructor.
 */
export interface ViewConstructor<T extends ArrayBufferView = ArrayBufferView> {
	/**
	 * View constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset.
	 * @param byteLength Byte length.
	 * @param littleEndian Little endian, big endian, or default.
	 */
	new (
		buffer: ArrayBufferLike,
		byteOffset: number,
		byteLength: number,
		littleEndian?: boolean | null,
	): T;
}

/**
 * Member: view.
 * For ViewConstructor compatible types.
 *
 * @param Member View constructor.
 * @param byteLength Byte length.
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function view<M extends ArrayBufferView, T extends Type>(
	Member: ViewConstructor<M>,
	byteLength: number,
	Type: TypeClass<T>,
	name: MembersExtends<T, M>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	let m: WeakMap<T, M>;
	return defineMember(Type, name, {
		byteOffset,
		byteLength: byteLength,
		littleEndian,
		kind: 'view',
		signed: null,
		Type: Member,
		get(): M {
			let r = (m ??= new WeakMap()).get(this);
			if (!r) {
				m.set(
					this,
					r = new Member(
						this.buffer,
						this.byteOffset + byteOffset,
						byteLength,
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
		littleEndian: null,
		kind: 'pad',
		signed: null,
		Type: null,
		get(): unknown {
			throw new TypeError(`Read from padding member: ${String(name)}`);
		},
		set(): void {
			throw new TypeError(`Write to padding member: ${String(name)}`);
		},
	});
}
