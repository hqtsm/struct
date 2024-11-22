import { assignView } from './macro.ts';
import type {
	MemberInfo,
	MemberInfos,
	MembersExtends,
	Struct,
} from './struct.ts';

/**
 * Member descriptor.
 */
export type MemberDescriptor<S extends Struct, M> = MemberInfo & {
	/**
	 * Getter function.
	 *
	 * @param this Struct instance.
	 * @returns Member value.
	 */
	get: (this: S) => M;

	/**
	 * Setter function.
	 *
	 * @param this Struct instance.
	 * @param value Member value.
	 */
	set: (this: S, value: M) => void;
};

/**
 * Define member.
 *
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param desc Member descriptor.
 * @returns Byte length.
 */
export function defineMember<C extends typeof Struct, M>(
	StructC: C & { MEMBERS: MemberInfos },
	name: MembersExtends<C['prototype'], M>,
	desc: MemberDescriptor<C['prototype'], M>,
): number {
	const { byteLength } = desc;
	Object.defineProperty(StructC.prototype, name, {
		configurable: true,
		enumerable: false,
		get: desc.get,
		set: desc.set,
	});
	(
		Object.hasOwn(StructC, 'MEMBERS' satisfies keyof C)
			? StructC.MEMBERS
			: StructC.MEMBERS = Object.create(StructC.MEMBERS)
	)[name] = {
		byteOffset: desc.byteOffset,
		byteLength,
		littleEndian: desc.littleEndian,
		Type: desc.Type,
	};
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
 * @param MemberC Member constructor.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function member<M extends MemberConstructor, C extends typeof Struct>(
	MemberC: M,
	StructC: C,
	name: MembersExtends<C['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<C['prototype'], InstanceType<M>>();
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: MemberC.BYTE_LENGTH,
		littleEndian,
		Type: MemberC,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				r = new MemberC(
					this.buffer,
					this.byteOffset + byteOffset,
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
 * ArrayType constructor.
 */
export type ArrayTypeConstructor = {
	/**
	 * ArrayType constructor.
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
 * For ArrayTypeConstructor compatible types.
 *
 * @param ArrayC Array constructor.
 * @param length Array length (element count).
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function array<M extends ArrayTypeConstructor, C extends typeof Struct>(
	ArrayC: M,
	length: number,
	StructC: C,
	name: MembersExtends<C['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<C['prototype'], InstanceType<M>>();
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: length * ArrayC.BYTES_PER_ELEMENT,
		littleEndian,
		Type: ArrayC,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				r = new ArrayC(
					this.buffer,
					this.byteOffset + byteOffset,
					length,
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
 * @param ViewC View constructor.
 * @param byteLength Byte length.
 * @param StructC Struct constructor.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Byte length.
 */
export function view<M extends ViewConstructor, C extends typeof Struct>(
	ViewC: M,
	byteLength: number,
	StructC: C,
	name: MembersExtends<C['prototype'], InstanceType<M>>,
	byteOffset: number,
	littleEndian: boolean | null = null,
): number {
	const m = new WeakMap<C['prototype'], InstanceType<M>>();
	return defineMember(StructC, name, {
		byteOffset,
		byteLength: byteLength,
		littleEndian,
		Type: ViewC,
		get(): InstanceType<M> {
			let r = m.get(this);
			if (!r) {
				r = new ViewC(
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