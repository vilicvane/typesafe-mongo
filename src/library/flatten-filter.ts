import _ from 'lodash';
import type {
  BSONRegExp,
  BSONType,
  BSONTypeAlias,
  BitwiseFilter,
  Document,
  Filter,
} from 'mongodb';

import type {AtomicType, LeafType} from './@mongo';
import {Atomic} from './atomic';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export type FilterSource<T extends object> = _FilterSource<T>;

export const flattenedFilterSymbol = Symbol('flattened filter');

export type FlattenedFilter<T> = Filter<T> & {
  [flattenedFilterSymbol]: true;
};

export function flattenFilter<T extends object>(
  source: FilterSource<T>,
): FlattenedFilter<T>;
export function flattenFilter(source: object): object {
  const filter: Record<string, unknown> = {};

  Object.defineProperty(filter, flattenedFilterSymbol, {
    value: true,
    enumerable: false,
  });

  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('$')) {
      filter[key] = value;
      continue;
    }

    if (value === undefined) {
      continue;
    }

    if (value instanceof Atomic) {
      filter[key] = value.value;
      continue;
    }

    if (!_.isPlainObject(value)) {
      filter[key] = value;
      continue;
    }

    const subFilter = flattenFilter(value);

    for (const [subKey, subValue] of Object.entries(subFilter)) {
      if (subKey.startsWith('$')) {
        if (!hasOwnProperty.call(filter, key)) {
          filter[key] = {};
        }

        (filter[key] as Record<string, unknown>)[subKey] = subValue;
      } else {
        filter[`${key}.${subKey}`] = subValue;
      }
    }
  }

  return filter;
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
  | FilterOperators<T, TBeingElement>;

export type ElementMatchFilter<T> = {
  [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
    ?
        | null
        | _ElementMatchFilterValue<T, false>
        | (T extends readonly (infer TElement)[]
            ? _ElementMatchFilterValue<TElement, true>
            : never)
    : never;
};

type _ElementMatchFilterValue<T, TBeingElement> =
  | T
  | FilterOperators<T, TBeingElement>;

export type FilterOperators<T, TBeingElement> =
  FilterOperatorsWithoutElementMatch<T> &
    (TBeingElement extends true
      ? {
          $elemMatch?: FlattenedFilter<T> | ElementMatchFilter<T>;
        }
      : {});

export interface FilterOperatorsWithoutElementMatch<T> {
  $eq?: T;
  $gt?: T;
  $gte?: T;
  $in?: readonly T[];
  $lt?: T;
  $lte?: T;
  $ne?: T;
  $nin?: readonly T[];
  $not?: T extends string
    ? FilterOperatorsWithoutElementMatch<T> | RegExp
    : FilterOperatorsWithoutElementMatch<T>;
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean;
  $type?: BSONType | BSONTypeAlias;
  $expr?: Record<string, any>;
  $jsonSchema?: Record<string, any>;
  $mod?: T extends number ? [number, number] : never;
  $regex?: T extends string ? RegExp | BSONRegExp | string : never;
  $options?: T extends string ? string : never;
  $geoIntersects?: {
    $geometry: Document;
  };
  $geoWithin?: Document;
  $near?: Document;
  $nearSphere?: Document;
  $maxDistance?: number;
  $all?: readonly any[];
  $size?: T extends readonly any[] ? number : never;
  $bitsAllClear?: BitwiseFilter;
  $bitsAllSet?: BitwiseFilter;
  $bitsAnyClear?: BitwiseFilter;
  $bitsAnySet?: BitwiseFilter;
  $rand?: Record<string, never>;
}
