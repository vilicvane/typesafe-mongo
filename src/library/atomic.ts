export const atomicSymbol = Symbol('atomic');

export class Atomic<T> {
  private [atomicSymbol] = true;

  constructor(readonly value: T) {}
}

export function atomic<T>(value: T): Atomic<T> {
  return new Atomic(value);
}
