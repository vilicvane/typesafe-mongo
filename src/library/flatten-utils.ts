import type {FlattenSource, Flattened} from './flatten';
import {flatten} from './flatten';

export type SortLeaf = 1 | -1;

export const sort = flatten as <T extends object>(
  source: T extends object ? FlattenSource<T, SortLeaf> : never,
) => Flattened<T, SortLeaf>;

export type ProjectLeaf = boolean;

export const project = flatten as <T extends object>(
  source: T extends object ? FlattenSource<T, ProjectLeaf> : never,
) => Flattened<T, ProjectLeaf>;
