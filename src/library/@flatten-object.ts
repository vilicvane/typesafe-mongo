import _ from 'lodash';

import {Atomic} from './atomic';

export function flattenObject(
  source: object,
  leafObjectTester: (value: object) => boolean,
): object {
  const flattened: Record<string, unknown> = {};

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

    if (leafObjectTester(value)) {
      flattened[key] = value;
      continue;
    }

    const subUpdate = flattenObject(value, leafObjectTester);

    for (const [subKey, subValue] of Object.entries(subUpdate)) {
      flattened[`${key}.${subKey}`] = subValue;
    }
  }

  return flattened;
}
