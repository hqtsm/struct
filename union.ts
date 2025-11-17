/**
 * @module
 *
 * Union type.
 */

import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Endian } from './endian.ts';
import type { MemberInfos, Members } from './members.ts';
import type { Type } from './type.ts';

let members: WeakMap<typeof Union, MemberInfos>;

/**
 * Binary union buffer view.
 */
export class Union extends Endian implements Type, Members {
	/**
	 * Union class.
	 */
	declare public readonly ['constructor']: Class<typeof Union>;

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
	public static readonly OVERLAPPING: boolean = true;

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
		toStringTag(this, 'Union');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'OVERLAPPING');
	}
}
