/**
 * @module
 *
 * Union type.
 */

import { constant, toStringTag } from '@hqtsm/class';
import { Endian } from './endian.ts';
import type { MemberInfos } from './members.ts';
import type { Type } from './type.ts';

const members = new WeakMap<typeof Union, MemberInfos>();

/**
 * Binary union buffer view.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Union<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>
	extends Endian<TArrayBuffer>
	implements Type<TArrayBuffer> {
	public get byteLength(): number {
		return (this.constructor as typeof Union).BYTE_LENGTH;
	}

	/**
	 * Byte length of struct.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Non-overlapping members.
	 */
	public static readonly OVERLAPPING: boolean = true;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): MemberInfos {
		let r = members.get(this);
		if (!r) {
			members.set(
				this,
				r = Object.create(
					Object.getPrototypeOf(this).MEMBERS ?? null,
				) as MemberInfos,
			);
		}
		return r;
	}

	static {
		toStringTag(this, 'Union');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'OVERLAPPING');
	}
}
