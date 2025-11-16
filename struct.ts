/**
 * @module
 *
 * Struct type.
 */

import { constant, toStringTag } from '@hqtsm/class';
import { Endian } from './endian.ts';
import type { MemberInfos, Members } from './members.ts';
import type { Type } from './type.ts';

let members: WeakMap<typeof Struct, MemberInfos>;

/**
 * Binary structure buffer view.
 */
export class Struct extends Endian implements Type, Members {
	/**
	 * Struct class.
	 */
	declare public readonly ['constructor']: Omit<typeof Struct, 'new'>;

	public get byteLength(): number {
		return this.constructor.BYTE_LENGTH;
	}

	/**
	 * Byte length of struct.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Non-overlapping members.
	 */
	public static readonly OVERLAPPING: boolean = false;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): MemberInfos {
		let r = (members ??= new WeakMap()).get(this);
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
		toStringTag(this, 'Struct');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'OVERLAPPING');
	}
}
