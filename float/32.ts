import { defaultMemberByteOffset, defineMember } from '../member.ts';
import type { MemberableClass, MemberableClassKeys } from '../members.ts';
import { Ptr } from '../ptr.ts';
import { dataView } from '../util.ts';

/**
 * Member: float32.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @param littleEndian Little endian, big endian, or default.
 * @returns Updated type byte length.
 */
export function float32<T extends MemberableClass>(
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
			return dataView(this.buffer).getFloat32(
				this.byteOffset + byteOffset,
				littleEndian ?? this.littleEndian,
			);
		},
		set(value: number): void {
			dataView(this.buffer).setFloat32(
				this.byteOffset + byteOffset,
				value,
				littleEndian ?? this.littleEndian,
			);
		},
	});
}

/**
 * Member: float32, big endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float32BE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float32(Type, name, byteOffset, false);
}

/**
 * Member: float32, little endian.
 *
 * @param Type Type class.
 * @param name Member name.
 * @param byteOffset Byte offset.
 * @returns Updated type byte length.
 */
export function float32LE<T extends MemberableClass>(
	Type: T,
	name: MemberableClassKeys<T, number>,
	byteOffset: number | null = null,
): number {
	return float32(Type, name, byteOffset, true);
}

/**
 * Pointer: float32.
 */
export class Float32Ptr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float32Ptr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
			this.littleEndian,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
			this.littleEndian,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Float32Ptr',
		});
	}
}

/**
 * Pointer: float32, big endian.
 */
export class Float32BEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float32BEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Float32BEPtr',
		});
	}
}

/**
 * Pointer: float32, little endian.
 */
export class Float32LEPtr extends Ptr<number> {
	declare public readonly ['constructor']: Omit<typeof Float32LEPtr, 'new'>;

	public override get(index: number): number {
		return dataView(this.buffer).getFloat32(
			this.byteOffset + index * 4,
			true,
		);
	}

	public override set(index: number, value: number): void {
		dataView(this.buffer).setFloat32(
			this.byteOffset + index * 4,
			value,
			true,
		);
	}

	public static override readonly BYTES_PER_ELEMENT: number = 4;

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: 'Float32LEPtr',
		});
	}
}
