# HQTSM: Struct

Binary structures

# Features

- Pure TypeScript, run anywhere
- Strong static type checking
- Tree shaking friendly design
- Public interface compatible with `ArrayBufferView`, like native binary types
- Support for little-endian, big-endian, and dynamic endian structures
- Support for inheritance, access modifiers, and child structures

# Usage

## Fixed Endianness

Endianness can be defined for each individual member.

```ts
import { int8, Struct, uint16BE, uint16LE } from '@hqtsm/struct';

class Example extends Struct {
	declare public alpha: number;

	declare public beta: number;

	declare public gamma: number;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint16LE(this, 'alpha', o);
		o += uint16BE(this, 'beta', o);
		o += int8(this, 'gamma', o);
		return o;
	})(super.BYTE_LENGTH);
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

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint16(this, 'alpha', o);
		o += uint16(this, 'beta', o);
		return o;
	})(super.BYTE_LENGTH);
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

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint32(this, 'type', o);
		return o;
	})(super.BYTE_LENGTH);
}

class VariableFloat extends Variable {
	declare public value: number;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += float32(this, 'value', o);
		return o;
	})(super.BYTE_LENGTH);
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

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint16BE(this, 'alpha', o);
		o += uint16BE(this, 'beta', o);
		return o;
	})(super.BYTE_LENGTH);
}

class Parent extends Struct {
	declare public child1: Child;

	declare public child2: Child;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += member(Child, this, 'child1', o);
		o += member(Child, this, 'child2', o);
		return o;
	})(super.BYTE_LENGTH);
}

const data = new Uint8Array(Parent.BYTE_LENGTH);
const stru = new Parent(data.buffer);
stru.child1.alpha = 97;
stru.child1.beta = 98;
stru.child2.alpha = 65;
stru.child2.beta = 66;
console.assert(data.join(' ') === '0 97 0 98 0 65 0 66');
```

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

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += uint8(this, 'alpha' as never, o);
		o += uint8(this, 'beta' as never, o);
		o += uint8(this, 'gamma', o);
		return o;
	})(super.BYTE_LENGTH);
}

const data = new Uint8Array(Example.BYTE_LENGTH);
const example = new Example(data.buffer);
example.setAlpha(65);
example.setBeta(66);
example.gamma = 71;
console.assert(data.join(' ') === '65 66 71');
```
