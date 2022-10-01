import _ from 'lodash';
import type {IntegerType, NumericType, Timestamp, UpdateFilter} from 'mongodb';

import type {AtomicType, LeafType} from './@mongo';
import {Atomic} from './atomic';
import type {FilterOperators} from './flatten-filter';

export function flattenUpdate<T extends object>(
  source: UpdateSource<T>,
): UpdateFilter<T>;
export function flattenUpdate(source: object): object {
  const update: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    switch (key) {
      case '$currentDate':
        update[key] = _flattenUpdateOperation(value, isCurrentDateOptions);
        break;
      case '$pull':
        update[key] = _flattenUpdateOperation(value, isPullOptions);
        break;
      case '$bit':
        update[key] = _flattenUpdateOperation(value, isBitOptions);
        break;
      default:
        update[key] = _flattenUpdateOperation(value, isNeverOptions);
        break;
    }
  }

  return update;
}

export function _flattenUpdateOperation(
  source: object,
  optionsObjectTester: (value: object) => boolean,
): object {
  const update: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      continue;
    }

    if (value instanceof Atomic) {
      update[key] = value.value;
      continue;
    }

    if (!_.isPlainObject(value)) {
      update[key] = value;
      continue;
    }

    if (optionsObjectTester(value)) {
      update[key] = value;
      continue;
    }

    const subUpdate = _flattenUpdateOperation(value, optionsObjectTester);

    for (const [subKey, subValue] of Object.entries(subUpdate)) {
      update[`${key}.${subKey}`] = subValue;
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

type _UpdateSourceValue<T, TFieldType, TUpdateOptionsMode, TUpdateOptions> = {
  [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
    ?
        | (T extends TFieldType
            ? _UpdateOptions<TUpdateOptionsMode, TUpdateOptions, T>
            : never)
        | (T extends LeafType
            ? never
            : T extends readonly (infer TElement)[]
            ? {
                [TPositionOperator in '$' | `$[${string}]`]: _UpdateSourceValue<
                  TElement,
                  TFieldType,
                  TUpdateOptionsMode,
                  TUpdateOptions
                >;
              }
            : _UpdateSourceValue<
                T,
                TFieldType,
                TUpdateOptionsMode,
                TUpdateOptions
              >)
    : never;
};

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
          | (TElement extends AtomicType ? TElement : Atomic<TElement>)
          | FilterOperators<TElement, false>
      : never
    : never;

function isCurrentDateOptions(object: object): boolean {
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

function isBitOptions(object: object): boolean {
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

function isPullOptions(object: object): boolean {
  const keys = Object.keys(object);

  return keys.every(key => key.startsWith('$'));
}

function isNeverOptions(_object: object): boolean {
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
