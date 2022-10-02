[![NPM version](https://img.shields.io/npm/v/typesafe-mongo?color=%23cb3837&style=flat-square)](https://www.npmjs.com/package/typesafe-mongo)
[![Repository package.json version](https://img.shields.io/github/package-json/v/vilic/typesafe-mongo?color=%230969da&label=repo&style=flat-square)](./package.json)
[![MIT license](https://img.shields.io/github/license/vilic/typesafe-mongo?style=flat-square)](./LICENSE)

# TypeSafe Mongo

TypeSafe utilities for official MongoDB Node.js driver.

## Installation

```sh
npm install typesafe-mongo
```

## Usage

```ts
import {flattenFilter} from 'typesafe-mongo';

interface AwesomeDocument {
  foo: {
    bar: string;
  };
  objects: {
    name: string;
    value: number;
  }[];
}

declare const collection: Collection<AwesomeDocument>;

await collection.findOne(
  flattenFilter({
    foo: {
      bar: {
        $eq: 'abc',
      },
    },
  }),
);

await collection.updateOne(
  flattenFilter({
    objects: {
      name: 'abc',
    },
  }),
  flattenUpdate({
    $set: {
      objects: {
        $: {
          value: 123,
        },
      },
    },
  }),
);

await collection.updateOne(
  flattenFilter({
    // Using `atomic()` to prevent a plain object from being flattened:
    objects: atomic({
      name: 'abc',
      value: 123,
    }),
  }),
  flattenUpdate({
    $set: {
      // Arrays will never be flattened, so in this case no `atomic()` needed.
      objects: [
        {
          name: 'abc',
          value: 123,
        },
      ],
    },
  }),
);
```

## License

MIT License.
