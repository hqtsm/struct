import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: int32.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function int32<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	return defineMember(Type, name, {
		byteLength: 4,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getInt32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setInt32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: int32, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int32BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return int32(Type, name, byteOffset, false);
}

/**
 * Member: int32, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function int32LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return int32(Type, name, byteOffset, true);
}

/**
 * Member: uint32.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function uint32<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
	littleEndian: boolean | null = null,
): number {
	byteOffset ??= defaultMemberByteOffset(Type);
	return defineMember(Type, name, {
		byteLength: 4,
		byteOffset,
		get(): number {
			return dataView(this.buffer).getUint32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setUint32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: uint32, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function uint32BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return uint32(Type, name, byteOffset, false);
}

/**
 * Member: uint32, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function uint32LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return uint32(Type, name, byteOffset, true);
}

/**
 * Pointer: int32.
 */
export class Int32Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Int32Ptr',
		});
	}
}

/**
 * Pointer: int32, big endian.
 */
export class Int32BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32BEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Int32BEPtr',
		});
	}
}

/**
 * Pointer: int32, little endian.
 */
export class Int32LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Int32LEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getInt32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setInt32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Int32LEPtr',
		});
	}
}

/**
 * Pointer: uint32.
 */
export class Uint32Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Uint32Ptr',
		});
	}
}

/**
 * Pointer: uint32, big endian.
 */
export class Uint32BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32BEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Uint32BEPtr',
		});
	}
}

/**
 * Pointer: uint32, little endian.
 */
export class Uint32LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Uint32LEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getUint32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setUint32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Uint32LEPtr',
		});
	}
}
