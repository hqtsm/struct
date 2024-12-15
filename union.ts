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
	declare public readonly ['constructor']: Omit<typeof Union, 'new'>;

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
}
