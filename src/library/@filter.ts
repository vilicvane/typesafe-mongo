import type {
  BSONRegExp,
  BSONType,
  BSONTypeAlias,
  BitwiseFilter,
  Document,
} from 'mongodb';

declare const __nominal_filter_of_source: unique symbol;

declare module 'mongodb' {
  interface RootFilterOperators<TSchema> {
    [__nominal_filter_of_source]: TSchema;
  }
}

export interface _FlattenedFilter<T> {
  [__nominal_filter_of_source]: T;
}

export type _FilterOperators<T, TBeingElement> =
  FilterOperatorsWithoutElementMatch<T> &
    (TBeingElement extends true
      ? {
          $elemMatch?: _FlattenedFilter<T> | _ElementMatchFilter<T>;
        }
      : {});

type _ElementMatchFilter<T> = {
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
  | _FilterOperators<T, TBeingElement>;

interface FilterOperatorsWithoutElementMatch<T> {
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
