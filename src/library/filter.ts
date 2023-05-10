import type {FilterOperators_, FlattenedFilter_} from './@filter';
import {flattenObject} from './@flatten-object';
import type {AtomicType, LeafType} from './@mongo';
import {isOperatorOrModifierObject} from './@utils';
import type {Atomic} from './atomic';

export type FilterSource<T extends object> = FilterSource_<T>;

/**
 * @deprecated Use {@link filter} instead.
 */
export const flattenFilter = filter;

export function filter<T extends object>(
  source: T extends object ? FilterSource<T> : never,
): FlattenedFilter_<T>;
export function filter(source: object): object {
  return flattenObject(source, isOperatorOrModifierObject, true);
}

type FilterSource_<T> =
  | {
      [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
        ? FilterSourceValue_<T>
        : never;
    }
  | (T extends readonly (infer TElement)[]
      ? {
          [TIndex in `${number}`]?: FilterSourceValue_<TElement>;
        }
      : never);

type FilterSourceValue_<T> =
  | null
  | FilterSourceElementValue_<T, false>
  | (T extends readonly (infer TElement)[]
      ? FilterSourceElementValue_<TElement, true>
      : never);

type FilterSourceElementValue_<T, TBeingElement> =
  | (T extends AtomicType ? T : Atomic<T>)
  | (T extends LeafType ? never : T extends object ? FilterSource_<T> : never)
  | FilterOperators_<T, TBeingElement>;
