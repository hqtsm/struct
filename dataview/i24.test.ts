import { assertEquals, assertThrows } from '@std/assert';

import { getInt24, getUint24, setInt24, setUint24 } from './i24.ts';

Deno.test('getInt24 unsigned', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56]);
	const dataView = new DataView(data.buffer);
	assertEquals(getInt24(dataView, 0, false), 0x123456);
	assertEquals(getInt24(dataView, 0, true), 0x563412);
});

Deno.test('getInt24 signed', () => {
	const data = new Uint8Array([0xff, 0xfe, 0xfd]);
	const dataView = new DataView(data.buffer);
	assertEquals(getInt24(dataView, 0, false), (0xfffefd << 8) >> 8);
	assertEquals(getInt24(dataView, 0, true), (0xfdfeff << 8) >> 8);
});

Deno.test('setInt24 unsigned', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setInt24(dataView, 0, 0x123456, false);
	assertEquals(data, new Uint8Array([0x12, 0x34, 0x56]));
	setInt24(dataView, 0, 0x123456, true);
	assertEquals(data, new Uint8Array([0x56, 0x34, 0x12]));
	data.fill(0);
	assertThrows(() => setInt24(dataView, -1, 0x123456, true), RangeError);
	assertEquals(data, new Uint8Array(3));
	data.fill(0);
	assertThrows(() => setInt24(dataView, 1, 0x123456, true), RangeError);
	assertEquals(data, new Uint8Array(3));
});

Deno.test('setInt24 signed', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setInt24(dataView, 0, (0xfffefd << 8) >> 8, false);
	assertEquals(data, new Uint8Array([0xff, 0xfe, 0xfd]));
	setInt24(dataView, 0, (0xfffefd << 8) >> 8, true);
	assertEquals(data, new Uint8Array([0xfd, 0xfe, 0xff]));
	data.fill(0);
	assertThrows(() => setInt24(dataView, -1, 0xfffefd, true), RangeError);
	assertEquals(data, new Uint8Array(3));
	data.fill(0);
	assertThrows(() => setInt24(dataView, 1, 0xfffefd, true), RangeError);
	assertEquals(data, new Uint8Array(3));
});

Deno.test('getUint24 unsigned', () => {
	const data = new Uint8Array([0x12, 0x34, 0x56]);
	const dataView = new DataView(data.buffer);
	assertEquals(getUint24(dataView, 0, false), 0x123456);
	assertEquals(getUint24(dataView, 0, true), 0x563412);
});

Deno.test('getUint24 signed', () => {
	const data = new Uint8Array([0xff, 0xfe, 0xfd]);
	const dataView = new DataView(data.buffer);
	assertEquals(getUint24(dataView, 0, false), 0xfffefd);
	assertEquals(getUint24(dataView, 0, true), 0xfdfeff);
});

Deno.test('setUint24 unsigned', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setUint24(dataView, 0, 0x123456, false);
	assertEquals(data, new Uint8Array([0x12, 0x34, 0x56]));
	setUint24(dataView, 0, 0x123456, true);
	assertEquals(data, new Uint8Array([0x56, 0x34, 0x12]));
	data.fill(0);
	assertThrows(() => setUint24(dataView, -1, 0x123456, true), RangeError);
	assertEquals(data, new Uint8Array(3));
	data.fill(0);
	assertThrows(() => setUint24(dataView, 1, 0x123456, true), RangeError);
	assertEquals(data, new Uint8Array(3));
});

Deno.test('setUint24 signed', () => {
	const data = new Uint8Array(3);
	const dataView = new DataView(data.buffer);
	setUint24(dataView, 0, (0xfffefd << 8) >> 8, false);
	assertEquals(data, new Uint8Array([0xff, 0xfe, 0xfd]));
	setUint24(dataView, 0, (0xfffefd << 8) >> 8, true);
	assertEquals(data, new Uint8Array([0xfd, 0xfe, 0xff]));
	data.fill(0);
	assertThrows(() => setUint24(dataView, -1, 0xfffefd, true), RangeError);
	assertEquals(data, new Uint8Array(3));
	data.fill(0);
	assertThrows(() => setUint24(dataView, 1, 0xfffefd, true), RangeError);
	assertEquals(data, new Uint8Array(3));
});
