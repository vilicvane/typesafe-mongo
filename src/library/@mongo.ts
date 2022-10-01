import type {Binary, ObjectId, Timestamp} from 'mongodb';

export type LeafType =
  | string
  | number
  | boolean
  | Date
  | RegExp
  | ObjectId
  | Binary
  | Timestamp
  | undefined;

export type AtomicType = LeafType | unknown[];
