import type {SortDirection} from 'mongodb';

import type {FlattenSource, FlattenedResult} from './flatten';
import {flatten} from './flatten';

export type SortLeaf = Extract<SortDirection, number | string>;

export const sort = flatten as <T extends object>(
  source: T extends object ? FlattenSource<T, SortLeaf> : never,
) => FlattenedResult<T, SortLeaf>;

export type ProjectLeaf = boolean;

export const project = flatten as <T extends object>(
  source: T extends object ? FlattenSource<T, ProjectLeaf> : never,
) => FlattenedResult<T, ProjectLeaf>;
