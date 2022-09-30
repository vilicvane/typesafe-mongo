export class Atomic<T> {
  constructor(readonly value: T) {}
}

export function atomic<T>(value: T): Atomic<T> {
  return new Atomic(value);
}
