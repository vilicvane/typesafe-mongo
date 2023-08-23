import type {ObjectId, Sort} from 'mongodb';

import type {Flattened, ProjectLeaf, SortLeaf} from '../library';
import {flatten, project, sort} from '../library';

interface A {
  _id: ObjectId;
  foo: string;
  bar?: {
    pia: number;
    hia: boolean;
  };
  items?: {
    key: string;
    value: number;
  }[];
}

flatten<A, number>({
  foo: 1,
  bar: {
    pia: -1,
  },
  items: {
    key: 1,
  },
});

flatten<A, number>({
  // @ts-expect-error
  foo: '',
  bar: {
    // @ts-expect-error
    baz: -1,
  },
});

sort<A>({
  foo: 1,
  bar: {
    pia: -1,
  },
});

sort<A>({
  // @ts-expect-error
  foo: 2,
  bar: {
    // @ts-expect-error
    baz: -1,
  },
});

project<A>({
  foo: true,
  bar: {
    pia: false,
  },
});

project<A>({
  // @ts-expect-error
  foo: 1,
  bar: {
    // @ts-expect-error
    baz: true,
  },
});

declare function test<T>(value: T): void;

test<Flattened<A, number>>(
  flatten({
    foo: 1,
    bar: {
      pia: -1,
    },
  }),
);

test<Flattened<A, number>>(
  flatten({
    // @ts-expect-error
    foo: '',
    bar: {
      // @ts-expect-error
      baz: -1,
    },
  }),
);

test<Flattened<A, SortLeaf>>(
  sort({
    foo: 1,
    bar: {
      pia: -1,
    },
  }),
);

test<Sort>(
  sort<A>({
    foo: 1,
    bar: {
      pia: -1,
    },
  }),
);

test<Flattened<A, SortLeaf>>(
  sort({
    // @ts-expect-error
    foo: 2,
    bar: {
      // @ts-expect-error
      baz: -1,
    },
  }),
);

test<Flattened<A, ProjectLeaf>>(
  project({
    foo: true,
    bar: {
      pia: false,
    },
  }),
);

test<Flattened<A, ProjectLeaf>>(
  project({
    // @ts-expect-error
    foo: 1,
    bar: {
      // @ts-expect-error
      baz: true,
    },
  }),
);
