import { assertEquals, assertStrictEquals } from '@std/assert';

import { uint8 } from '../int/8.ts';
import { Struct } from '../struct.ts';
import { ArrayType } from './type.ts';

class MembersThree8 extends Struct {
	declare public alpha: number;
	declare public beta: number;
	declare public gamma: number;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint8(this, 'alpha', o);
		o += uint8(this, 'beta', o);
		o += uint8(this, 'gamma', o);
		return o;
	})(super.BYTE_LENGTH);
}

Deno.test('ArrayType of', () => {
	assertStrictEquals(
		ArrayType.of(MembersThree8),
		ArrayType.of(MembersThree8),
	);
	assertEquals(ArrayType.of(MembersThree8).name, 'ArrayType<MembersThree8>');
});

Deno.test('ArrayType get/set', () => {
	const Arr = ArrayType.of(MembersThree8);

	const arr = new Arr(new ArrayBuffer(Arr.BYTES_PER_ELEMENT * 3 + 1), 1, 3);

	assertStrictEquals(arr[0].constructor, MembersThree8);
	assertStrictEquals(arr[0], arr[0]);

	arr[0].alpha = 1;
	arr[0].beta = 2;
	arr[0].gamma = 3;

	assertEquals(arr[0].alpha, 1);
	assertEquals(arr[0].beta, 2);
	assertEquals(arr[0].gamma, 3);

	const value = new MembersThree8(new ArrayBuffer(MembersThree8.BYTE_LENGTH));

	value.alpha = 4;
	value.beta = 5;
	value.gamma = 6;
	arr[0] = value;

	value.alpha = 7;
	value.beta = 8;
	value.gamma = 9;
	arr[1] = value;

	assertEquals(arr[0].alpha, 4);
	assertEquals(arr[0].beta, 5);
	assertEquals(arr[0].gamma, 6);
	assertEquals(arr[1].alpha, 7);
	assertEquals(arr[1].beta, 8);
	assertEquals(arr[1].gamma, 9);
});
