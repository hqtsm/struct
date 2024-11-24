import { assignView } from './util.ts';
import type {
	MemberInfo,
	MemberInfos,
	MembersExtends,
	Type,
	TypeClass,
} from './type.ts';

/**
 * Member descriptor.
 */
export type MemberDescriptor<T extends Type, M> = MemberInfo & {
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
};

/**
 * Define member.
 *
 * @param Type Type constructor.
 * @param name Member name.
 * @param desc Member descriptor.
 * @returns Byte length.
 */
export function defineMember<T extends TypeClass, M>(
	Type: T,
	name: MembersExtends<T['prototype'], M>,
	desc: MemberDescriptor<T['prototype'], M>,
): number {
	const { byteLength } = desc;
	Object.defineProperty(Type.prototype, name, {
		configurable: true,
		enumerable: false,
		get: desc.get,
		set: desc.set,
	});
	(
		Object.hasOwn(Type, 'MEMBERS' satisfies keyof T)
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
export type MemberConstructor = {
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
	): ArrayBufferView;

	/**
	 * Byte length.
	 */
	readonly BYTE_LENGTH: number;
};

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
export function member<M extends MemberConstructor, T extends TypeClass>(
	Member: M,
	Type: T,
	name: MembersExtends<T['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<T['prototype'], InstanceType<M>>();
	return defineMember(Type, name, {
		byteOffset,
		byteLength: Member.BYTE_LENGTH,
		littleEndian,
		kind: 'member',
		signed: null,
		Type: Member,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				m.set(
					this,
					r = new Member(
						this.buffer,
						this.byteOffset + byteOffset,
						littleEndian ?? this.littleEndian,
					) as InstanceType<M>,
				);
			}
			return r;
		},
		set(value): void {
			assignView(this[name] as InstanceType<M>, value);
		},
	});
}

/**
 * Array constructor.
 */
export type ArrayConstructor = {
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
	): ArrayBufferView;

	/**
	 * Bytes length for each element.
	 */
	readonly BYTES_PER_ELEMENT: number;
};

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
export function array<M extends ArrayConstructor, T extends TypeClass>(
	Member: M,
	length: number,
	Type: T,
	name: MembersExtends<T['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<T['prototype'], InstanceType<M>>();
	return defineMember(Type, name, {
		byteOffset,
		byteLength: length * Member.BYTES_PER_ELEMENT,
		littleEndian,
		kind: 'array',
		signed: null,
		Type: Member,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				m.set(
					this,
					r = new Member(
						this.buffer,
						this.byteOffset + byteOffset,
						length,
						littleEndian ?? this.littleEndian,
					) as InstanceType<M>,
				);
			}
			return r;
		},
		set(value): void {
			assignView(this[name] as InstanceType<M>, value);
		},
	});
}

/**
 * View constructor.
 */
export type ViewConstructor = {
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
	): ArrayBufferView;
};

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
export function view<M extends ViewConstructor, T extends TypeClass>(
	Member: M,
	byteLength: number,
	Type: T,
	name: MembersExtends<T['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<T['prototype'], InstanceType<M>>();
	return defineMember(Type, name, {
		byteOffset,
		byteLength: byteLength,
		littleEndian,
		kind: 'view',
		signed: null,
		Type: Member,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				r = new Member(
					this.buffer,
					this.byteOffset + byteOffset,
					byteLength,
					littleEndian ?? this.littleEndian,
				) as InstanceType<M>;
				m.set(this, r);
			}
			return r;
		},
		set(value): void {
			assignView(this[name] as InstanceType<M>, value);
		},
	});
}

/**
 * Member: padding.
 *
 * @param byteLength Padding size.
 * @param Type Type constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function pad<T extends TypeClass>(
	byteLength: number,
	Type: T,
	name: MembersExtends<T['prototype'], unknown>,
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
		set(_value: unknown): void {
			throw new TypeError(`Write to padding member: ${String(name)}`);
		},
	});
}
