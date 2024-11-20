# HQTSM: Struct

Binary structures

# Features

- Pure TypeScript, run anywhere
- Strong static type checking
- Tree shaking friendly design
- Support for little-endian, big-endian, and dynamic endian values.

# Usage

## Fixed Endianness

Endianness can be defined for each individual member.

```ts
import { memberU16, memberU8, Struct } from '@hqtsm/struct';

export class Example extends Struct {
	declare public readonly ['constructor']: typeof Example;

	declare public alpha: number;

	declare public beta: number;

	declare public gamma: number;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += memberU16(this, 'alpha', o, true);
		o += memberU16(this, 'beta', o, false);
		o += memberU8(this, 'gamma', o);
		return o;
	})(super.BYTE_LENGTH);
}

const data = new Uint8Array(Example.BYTE_LENGTH);

const example = new Example(data.buffer);
example.alpha = 0xABCD;
example.beta = 0xBCDE;
example.gamma = 123;
console.assert(data.join(', ') === '205, 171, 188, 222, 123');
```

## Dynamic Endianness

Using the endian passed into the constructor, or host endianness.

```ts
import { memberU16, Struct } from '@hqtsm/struct';

export class Example extends Struct {
	declare public readonly ['constructor']: typeof Example;

	declare public alpha: number;

	declare public beta: number;

	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += memberU16(this, 'alpha', o);
		o += memberU16(this, 'beta', o);
		return o;
	})(super.BYTE_LENGTH);
}

const data = new Uint8Array(Example.BYTE_LENGTH);

const exampleLE = new Example(data.buffer, 0, true);
exampleLE.alpha = 0xABCD;
exampleLE.beta = 0xBCDE;
console.assert(data.join(', ') === '205, 171, 222, 188');

const exampleBE = new Example(data.buffer, 0, false);
exampleBE.alpha = 0xABCD;
exampleBE.beta = 0xBCDE;
console.assert(data.join(', ') === '171, 205, 188, 222');
```
