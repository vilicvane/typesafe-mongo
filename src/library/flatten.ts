import {flattenObject} from './@flatten-object';
import type {LeafType} from './@mongo';

export type FlattenSource<
  T extends object,
  TLeaf extends LeafType,
> = FlattenSource_<T, TLeaf>;

export function flatten<T extends object, TLeaf extends LeafType>(
  source: T extends object ? FlattenSource<T, TLeaf> : never,
): Flattened<T, TLeaf> {
  return flattenObject(source, () => false, true);
}

type FlattenSource_<T, TLeaf> =
  | {
      [TKey in keyof T]?: NonNullable<T[TKey]> extends infer T
        ? FlattenSourceValue_<T, TLeaf>
        : never;
    }
  | (T extends readonly (infer TElement)[]
      ? {
          [TIndex in `${number}`]?: FlattenSourceValue_<TElement, TLeaf>;
        }
      : never);

type FlattenSourceValue_<T, TLeaf> =
  | FlattenSourceElementValue_<T, TLeaf>
  | (T extends readonly (infer TElement)[]
      ? FlattenSourceElementValue_<TElement, TLeaf>
      : never);

type FlattenSourceElementValue_<T, TLeaf> =
  | (T extends LeafType
      ? never
      : T extends object
      ? FlattenSource_<T, TLeaf>
      : never)
  | TLeaf;

declare const __nominal_flattened_source: unique symbol;
declare const __nominal_flattened_leaf: unique symbol;

export interface Flattened<T extends object, TLeaf> {
  [__nominal_flattened_source]?: T;
  [__nominal_flattened_leaf]?: TLeaf;
}
