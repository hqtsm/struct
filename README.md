# HQTSM: Struct

Binary structures

![binary](https://img.shields.io/badge/binary-eee)
![struct](https://img.shields.io/badge/struct-eee)
![union](https://img.shields.io/badge/union-eee)
![pointer](https://img.shields.io/badge/pointer-eee)
![array](https://img.shields.io/badge/array-eee)
![endian](https://img.shields.io/badge/endian-eee)
![dataview](https://img.shields.io/badge/dataview-eee)
![arraybuffer](https://img.shields.io/badge/arraybuffer-eee)

[![JSR](https://jsr.io/badges/@hqtsm/struct)](https://jsr.io/@hqtsm/struct)
[![npm](https://img.shields.io/npm/v/@hqtsm/struct.svg)](https://npmjs.com/package/@hqtsm/struct)
[![CI](https://github.com/hqtsm/struct/actions/workflows/ci.yaml/badge.svg)](https://github.com/hqtsm/struct/actions/workflows/ci.yaml)

# Features

- Pure TypeScript, run anywhere
- Strong static type checking
- Tree shaking friendly design
- Public interface compatible with `ArrayBufferView`, like native binary types
- Support for little-endian, big-endian, and dynamic endian
- Support for structures, unions, pointers, arrays, inheritance, and more

# Usage

## Fixed Endianness

Endianness can be defined for each individual member.

```ts
import { int8, Struct, uint16BE, uint16LE } from '@hqtsm/struct';

class Example extends Struct {
	declare public alpha: number;

	declare public beta: number;

	declare public gamma: number;

	static {
		uint16LE(this, 'alpha');
		uint16BE(this, 'beta');
		int8(this, 'gamma');
	}
}

const data = new Uint8Array(Example.BYTE_LENGTH);

const example = new Example(data.buffer);
example.alpha = 0xABCD;
example.beta = 0xBCDE;
example.gamma = -123;
console.assert(data.join(' ') === '205 171 188 222 133');
```

## Dynamic Endianness

Using the endian passed into the constructor, or host endianness.

```ts
import { Struct, uint16 } from '@hqtsm/struct';

class Example extends Struct {
	declare public alpha: number;

	declare public beta: number;

	static {
		uint16(this, 'alpha');
		uint16(this, 'beta');
	}
}

const data = new Uint8Array(Example.BYTE_LENGTH);

const exampleLE = new Example(data.buffer, 0, true);
exampleLE.alpha = 0xABCD;
exampleLE.beta = 0xBCDE;
console.assert(data.join(' ') === '205 171 222 188');

const exampleBE = new Example(data.buffer, 0, false);
exampleBE.alpha = 0xABCD;
exampleBE.beta = 0xBCDE;
console.assert(data.join(' ') === '171 205 188 222');
```

## Extending / Inheritance

Structures can be extended with new child members.

```ts
import { float32, Struct, uint32 } from '@hqtsm/struct';

class Variable extends Struct {
	declare public type: number;

	static {
		uint32(this, 'type');
	}
}

class VariableFloat extends Variable {
	declare public value: number;

	static {
		float32(this, 'value');
	}
}

const data = new Uint8Array(VariableFloat.BYTE_LENGTH);
const varFloat = new VariableFloat(data.buffer, 0, true);
varFloat.type = 0xF;
varFloat.value = 3.1415;
console.assert(data.join(' ') === '15 0 0 0 86 14 73 64');
```

## Child Structures

Defining a child structure is easy.

```ts
import { Arr, array, member, Struct, uint16BE, Uint8Ptr } from '@hqtsm/struct';

class Child extends Struct {
	declare public alpha: number;

	declare public beta: number;

	static {
		uint16BE(this, 'alpha');
		uint16BE(this, 'beta');
	}
}

class Parent extends Struct {
	declare public child1: Child;

	declare public child2: Child;

	static {
		member(Child, this, 'child1');
		member(Child, this, 'child2');
	}
}

const data = new Uint8Array(Parent.BYTE_LENGTH);
const stru = new Parent(data.buffer);
stru.child1.alpha = 97;
stru.child1.beta = 98;
stru.child2.alpha = 65;
stru.child2.beta = 66;
console.assert(data.join(' ') === '0 97 0 98 0 65 0 66');
```

## Pointer

Comes with pointers for primitives, and a factory for pointers to types.

```ts
import { int8, Int8Ptr, pointer, Struct } from '@hqtsm/struct';

const data = new Int8Array(6);
const i8p = new Int8Ptr(data.buffer, 2);

// Setting values by index.
i8p[0] = 0;
i8p[1] = 1;
i8p[2] = 2;
i8p[3] = 3;

// Negative indexing also works.
i8p[-1] = -1;
i8p[-2] = -2;

console.assert(data.join(' ') === '-2 -1 0 1 2 3');

class XY extends Struct {
	declare public x: number;

	declare public y: number;

	static {
		int8(this, 'x');
		int8(this, 'y');
	}
}

// Pointer for custom type.
const XYPtr = pointer(XY);
const xyp = new XYPtr(data.buffer, 2);

console.assert(xyp[0].x === 0);
console.assert(xyp[0].y === 1);
console.assert(xyp[1].x === 2);
console.assert(xyp[1].y === 3);
console.assert(xyp[-1].x === -2);
console.assert(xyp[-1].y === -1);

// Type memory can also be assigned.
const xy = new XY(new ArrayBuffer(XY.BYTE_LENGTH));
xy.x = 88;
xy.y = 89;
xyp[0] = xy;
console.assert(data.join(' ') === '-2 -1 88 89 2 3');
```

## Array

A pointer extended to a type of a fixed length.

```ts
import {
	Arr,
	array,
	int8,
	member,
	pointer,
	Struct,
	Uint8Ptr,
} from '@hqtsm/struct';

class XY extends Struct {
	declare public x: number;

	declare public y: number;

	static {
		int8(this, 'x');
		int8(this, 'y');
	}
}

class Example extends Struct {
	declare public bytes: Arr<number>;

	declare public xys: Arr<XY>;

	static {
		member(array(Uint8Ptr, 4), this, 'bytes');
		member(array(XY, 2), this, 'xys');
	}
}

const data = new Uint8Array(Example.BYTE_LENGTH);
const example = new Example(data.buffer);
example.bytes[0] = 10;
example.bytes[1] = 20;
example.bytes[2] = 30;
example.bytes[3] = 40;
example.xys[0].x = 150;
example.xys[0].y = 160;
example.xys[1].x = 170;
example.xys[1].y = 180;
console.assert(data.join(' ') === '10 20 30 40 150 160 170 180');
```

## Union

A union will automatically use overlapping member memory.

```ts
import { Arr, array, member, uint32BE, Uint8Ptr, Union } from '@hqtsm/struct';

class FourCC extends Union {
	declare public int: number;

	declare public chars: Arr<number>;

	static {
		uint32BE(this, 'int');
		member(array(Uint8Ptr, 4), this, 'chars');
	}
}

const data = new Uint8Array(FourCC.BYTE_LENGTH);
const four = new FourCC(data.buffer);
four.int = 0x41424344;
console.assert(four.chars[0] === 0x41);
console.assert(String.fromCharCode(...four.chars) === 'ABCD');
```

## Alignment / Padding

By default member memory is sequentially without alignment or padding.

```ts
import { pad, Struct, uint32, uint8 } from '@hqtsm/struct';

class Example extends Struct {
	declare private alpha: number;

	declare protected beta: number;

	declare public gamma: number;

	public setAlpha(value: number): void {
		this.alpha = value;
	}

	public setBeta(value: number): void {
		this.beta = value;
	}

	static {
		uint8(this, 'alpha' as never);
		uint32(this, 'beta' as never);
		uint8(this, 'gamma');
	}
}

console.assert(Example.BYTE_LENGTH === 6);
```

Padding can be manually added as a property or anonymously.

```ts
import { pad, Struct, uint32, uint8 } from '@hqtsm/struct';

class Example extends Struct {
	declare private alpha: number;

	declare public padding: never;

	declare protected beta: number;

	declare public gamma: number;

	public setAlpha(value: number): void {
		this.alpha = value;
	}

	public setBeta(value: number): void {
		this.beta = value;
	}

	static {
		uint8(this, 'alpha' as never);
		pad(3, this, 'padding'); // Property.
		uint32(this, 'beta' as never);
		uint8(this, 'gamma');
		pad(3, this); // Anonymous.
	}
}

console.assert(Example.BYTE_LENGTH === 12);
```

Using intergers or arrays for padding also works.

## Private / Protected

Members can be made `private` or `protected` but type checking must be relaxed.

Casting the name to `never` or `any` will pass the type checker.

```ts
import { Struct, uint8 } from '@hqtsm/struct';

class Example extends Struct {
	declare private alpha: number;

	declare protected beta: number;

	declare public gamma: number;

	public setAlpha(value: number): void {
		this.alpha = value;
	}

	public setBeta(value: number): void {
		this.beta = value;
	}

	static {
		uint8(this, 'alpha' as never);
		uint8(this, 'beta' as never);
		uint8(this, 'gamma');
	}
}

const data = new Uint8Array(Example.BYTE_LENGTH);
const example = new Example(data.buffer);
example.setAlpha(65);
example.setBeta(66);
example.gamma = 71;
console.assert(data.join(' ') === '65 66 71');
```
