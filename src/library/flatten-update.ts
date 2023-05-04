import _ from 'lodash';
import type {IntegerType, NumericType, Timestamp, UpdateFilter} from 'mongodb';

import type {_FilterOperators, _FlattenedFilter} from './@filter';
import {flattenObject} from './@flatten-object';
import type {AtomicType, LeafType} from './@mongo';
import {isOperatorObject} from './@utils';
import type {Atomic} from './atomic';

export function flattenUpdate<T extends object>(
  source: T extends object ? UpdateSource<T> : never,
): UpdateFilter<T>;
export function flattenUpdate(source: object): object {
  const update: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    switch (key) {
      case '$currentDate':
        update[key] = flattenObject(value, isCurrentDateOptionsObject, false);
        break;
      case '$pull':
        update[key] = flattenObject(value, isOperatorObject, false);
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
    | _UpdateSourceValue<T, Date, 'static', true | {$type: 'date'}>
    | _UpdateSourceValue<T, Timestamp, 'static', {$type: 'timestamp'}>;
  $inc?: _UpdateSourceValue<T, NumericType, 'static', NumericType>;
  $min?: _UpdateSourceValue<T, unknown, 'value', unknown>;
  $max?: _UpdateSourceValue<T, unknown, 'value', unknown>;
  $mul?: _UpdateSourceValue<T, NumericType, 'static', NumericType>;
  $rename?: Record<string, string>;
  $set?: _UpdateSourceValue<T, unknown, 'value', unknown>;
  $setOnInsert?: _UpdateSourceValue<T, unknown, 'value', unknown>;
  $unset?: _UpdateSourceValue<T, unknown, 'static', '' | true | 1>;
  $addToSet?: _UpdateSourceValue<T, readonly unknown[], 'element', unknown>;
  $pop?: _UpdateSourceValue<T, readonly unknown[], 'static', 1 | -1>;
  $pull?: _UpdateSourceValue<T, readonly unknown[], 'element-match', unknown>;
  $push?: _UpdateSourceValue<T, readonly unknown[], 'element', unknown>;
  $pullAll?: _UpdateSourceValue<T, readonly unknown[], 'value', unknown>;
  $bit?: _UpdateSourceValue<
    T,
    NumericType,
    'static',
    {and: IntegerType} | {or: IntegerType} | {xor: IntegerType}
  >;
}

type PositionOperator = '$' | `$[${string}]` | `${number}`;

type _UpdateSourceValue<T, TFieldType, TUpdateOptionsMode, TUpdateOptions> = {
  [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
    ?
        | (T extends TFieldType
            ? _UpdateOptions<TUpdateOptionsMode, TUpdateOptions, T>
            : never)
        | (T extends LeafType
            ? never
            : T extends readonly (infer TElement)[]
            ? _DistributeKey<
                PositionOperator,
                _UpdateSourceValue<
                  TElement,
                  TFieldType,
                  TUpdateOptionsMode,
                  TUpdateOptions
                >
              >
            : _UpdateSourceValue<
                T,
                TFieldType,
                TUpdateOptionsMode,
                TUpdateOptions
              >)
    : never;
};

type _DistributeKey<TKeyUnion, TValue> = TKeyUnion extends string
  ? {
      [TKey in TKeyUnion]: TValue;
    }
  : never;

type _UpdateOptions<TUpdateOptionsMode, TUpdateOptions, T> =
  TUpdateOptionsMode extends 'static'
    ? TUpdateOptions
    : TUpdateOptionsMode extends 'value'
    ? T extends AtomicType
      ? T
      : Atomic<T>
    : TUpdateOptionsMode extends 'element'
    ? T extends readonly (infer TElement)[]
      ? TElement extends AtomicType
        ? TElement
        : Atomic<TElement>
      : never
    : TUpdateOptionsMode extends 'element-match'
    ? T extends readonly (infer TElement)[]
      ?
          | (TElement extends AtomicType ? TElement : Atomic<Partial<TElement>>)
          | _FilterOperators<TElement, false>
          | _FlattenedFilter<TElement>
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
