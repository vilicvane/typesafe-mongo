import type {_FilterOperators, _FlattenedFilter} from './@filter';
import {flattenObject} from './@flatten-object';
import type {AtomicType, LeafType} from './@mongo';
import {isOperatorObject} from './@utils';
import type {Atomic} from './atomic';

export type FilterSource<T extends object> = _FilterSource<T>;

/**
 * @deprecated Use {@link filter} instead.
 */
export const flattenFilter = filter;

export function filter<T extends object>(
  source: T extends object ? FilterSource<T> : never,
): _FlattenedFilter<T>;
export function filter(source: object): object {
  return flattenObject(source, isOperatorObject, true);
}

type _FilterSource<T> =
  | {
      [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
        ? _FilterSourceValue<T>
        : never;
    }
  | (T extends readonly (infer TElement)[]
      ? {
          [TIndex in `${number}`]?: _FilterSourceValue<TElement>;
        }
      : never);

type _FilterSourceValue<T> =
  | null
  | _FilterSourceElementValue<T, false>
  | (T extends readonly (infer TElement)[]
      ? _FilterSourceElementValue<TElement, true>
      : never);

type _FilterSourceElementValue<T, TBeingElement> =
  | (T extends AtomicType ? T : Atomic<T>)
  | (T extends LeafType ? never : T extends object ? _FilterSource<T> : never)
  | _FilterOperators<T, TBeingElement>;
