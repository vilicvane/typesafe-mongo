export const atomicSymbol = Symbol('atomic');

export class Atomic<T> {
  declare [atomicSymbol]: true;

  constructor(readonly value: T) {}
}

export function atomic<T>(value: T): T extends unknown ? Atomic<T> : never;
export function atomic(value: unknown): Atomic<unknown> {
  return new Atomic(value);
}
