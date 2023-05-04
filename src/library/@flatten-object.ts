import _ from 'lodash';

import {Atomic} from './atomic';

const __flattened = Symbol('flattened');

export function flattenObject(
  source: object,
  leafObjectTester: (value: object) => boolean,
  annotate: boolean,
): object {
  const flattened: Record<string, unknown> = {};

  if (annotate) {
    Object.defineProperty(flattened, __flattened, {
      enumerable: false,
      writable: false,
      value: true,
    });
  }

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      continue;
    }

    if (value instanceof Atomic) {
      flattened[key] = value.value;
      continue;
    }

    if (!_.isPlainObject(value)) {
      flattened[key] = value;
      continue;
    }

    if (__flattened in value || leafObjectTester(value)) {
      flattened[key] = value;
      continue;
    }

    const subUpdate = flattenObject(value, leafObjectTester, false);

    for (const [subKey, subValue] of Object.entries(subUpdate)) {
      flattened[`${key}.${subKey}`] = subValue;
    }
  }

  return flattened;
}
