declare const __nominal_atomic: unique symbol;

export class Atomic<T> {
  declare [__nominal_atomic]: T;

  constructor(readonly value: T) {}
}

export function atomic<T>(value: T): T extends unknown ? Atomic<T> : never;
export function atomic(value: unknown): Atomic<unknown> {
  return new Atomic(value);
}
