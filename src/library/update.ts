import _ from 'lodash';
import type {IntegerType, NumericType, Timestamp, UpdateFilter} from 'mongodb';

import type {FilterOperators_, FlattenedFilter_} from './@filter';
import {flattenObject} from './@flatten-object';
import type {AtomicType, LeafType} from './@mongo';
import {isOperatorOrModifierObject} from './@utils';
import type {Atomic} from './atomic';

/**
 * @deprecated Use {@link update} instead.
 */
export const flattenUpdate = update;

export function update<T extends object>(
  source: T extends object ? UpdateSource<T> : never,
): UpdateFilter<T>;
export function update(source: object): object {
  const update: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    switch (key) {
      case '$currentDate':
        update[key] = flattenObject(value, isCurrentDateOptionsObject, false);
        break;
      case '$addToSet':
      case '$push':
      case '$pull':
        update[key] = flattenObject(value, isOperatorOrModifierObject, false);
        break;
      case '$bit':
        update[key] = flattenObject(value, isBitOptionsObject, false);
        break;
      default:
        update[key] = flattenObject(value, isNeverOptionsObject, false);
        break;
    }
  }

  return update;
}

export interface UpdateSource<T extends object> {
  $currentDate?:
    | UpdateSourceValue_<T, Date, 'static', true | {$type: 'date'}>
    | UpdateSourceValue_<T, Timestamp, 'static', {$type: 'timestamp'}>;
  $inc?: UpdateSourceValue_<T, NumericType, 'static', NumericType>;
  $min?: UpdateSourceValue_<T, unknown, 'value', unknown>;
  $max?: UpdateSourceValue_<T, unknown, 'value', unknown>;
  $mul?: UpdateSourceValue_<T, NumericType, 'static', NumericType>;
  $rename?: Record<string, string>;
  $set?: UpdateSourceValue_<T, unknown, 'value', unknown>;
  $setOnInsert?: UpdateSourceValue_<T, unknown, 'value', unknown>;
  $unset?: UpdateSourceValue_<T, unknown, 'static', '' | true | 1>;
  $addToSet?: UpdateSourceValue_<T, readonly unknown[], 'add-to-set', unknown>;
  $pop?: UpdateSourceValue_<T, readonly unknown[], 'static', 1 | -1>;
  $pull?: UpdateSourceValue_<T, readonly unknown[], 'element-match', unknown>;
  $push?: UpdateSourceValue_<T, readonly unknown[], 'push', unknown>;
  $pullAll?: UpdateSourceValue_<T, readonly unknown[], 'value', unknown>;
  $bit?: UpdateSourceValue_<
    T,
    NumericType,
    'static',
    {and: IntegerType} | {or: IntegerType} | {xor: IntegerType}
  >;
}

type PositionOperator = '$' | `$[${string}]` | `${number}`;

type UpdateSourceValue_<T, TFieldType, TUpdateOptionsMode, TUpdateOptions> = {
  [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
    ?
        | (T extends TFieldType
            ? UpdateOptions_<TUpdateOptionsMode, TUpdateOptions, T>
            : never)
        | (T extends LeafType
            ? never
            : T extends readonly (infer TElement)[]
            ? DistributeKey_<
                PositionOperator,
                UpdateSourceValue_<
                  TElement,
                  TFieldType,
                  TUpdateOptionsMode,
                  TUpdateOptions
                >
              >
            : UpdateSourceValue_<
                T,
                TFieldType,
                TUpdateOptionsMode,
                TUpdateOptions
              >)
    : never;
};

type DistributeKey_<TKeyUnion, TValue> = TKeyUnion extends string
  ? {
      [TKey in TKeyUnion]: TValue;
    }
  : never;

type UpdateOptions_<TUpdateOptionsMode, TUpdateOptions, T> =
  TUpdateOptionsMode extends 'static'
    ? TUpdateOptions
    : TUpdateOptionsMode extends 'value'
    ? T extends AtomicType
      ? T
      : Atomic<T>
    : TUpdateOptionsMode extends 'push'
    ? T extends readonly (infer TElement)[]
      ?
          | (TElement extends AtomicType ? TElement : Atomic<TElement>)
          | {
              $each: TElement[];
              $slice?: number;
              $sort?: object;
              $position?: number;
            }
      : never
    : TUpdateOptionsMode extends 'add-to-set'
    ? T extends readonly (infer TElement)[]
      ?
          | (TElement extends AtomicType ? TElement : Atomic<TElement>)
          | {$each: TElement[]}
      : never
    : TUpdateOptionsMode extends 'element-match'
    ? T extends readonly (infer TElement)[]
      ?
          | (TElement extends AtomicType ? TElement : Atomic<Partial<TElement>>)
          | FilterOperators_<TElement, false>
          | FlattenedFilter_<TElement>
      : never
    : never;

function isCurrentDateOptionsObject(object: object): boolean {
  return testOnlyKeyValue(
    object,
    key => key === '$type',
    value => {
      switch (value) {
        case 'date':
        case 'timestamp':
          return true;
        default:
          return false;
      }
    },
  );
}

function isBitOptionsObject(object: object): boolean {
  return testOnlyKeyValue(
    object,
    key => {
      switch (key) {
        case 'and':
        case 'or':
        case 'xor':
          return true;
        default:
          return false;
      }
    },
    value => !_.isPlainObject(value),
  );
}

function isNeverOptionsObject(_object: object): boolean {
  return false;
}

function testOnlyKeyValue(
  object: object,
  keyTester: (key: string) => boolean,
  valueTester: (value: unknown) => boolean,
): boolean {
  const entries = Object.entries(object);

  if (entries.length > 1) {
    return false;
  }

  const [entryKey, entryValue] = entries[0];

  return keyTester(entryKey) && valueTester(entryValue);
}
