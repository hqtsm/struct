import { Endian } from './endian.ts';
import type { MemberInfos, Type } from './type.ts';

let members: WeakMap<typeof Struct, MemberInfos>;

/**
 * Binary structure buffer view.
 */
export class Struct extends Endian implements Type {
	declare public readonly ['constructor']: Omit<typeof Struct, 'new'>;

	public get byteLength(): number {
		return this.constructor.BYTE_LENGTH;
	}

	/**
	 * Byte length of struct.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Members infos.
	 */
	public static get MEMBERS(): Readonly<MemberInfos> {
		let r = (members ??= new WeakMap()).get(this);
		if (!r) {
			members.set(
				this,
				r = Object.create(
					Object.getPrototypeOf(this).MEMBERS ?? null,
				) as Readonly<MemberInfos>,
			);
		}
		return r;
	}
}
