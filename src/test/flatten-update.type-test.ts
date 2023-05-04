import {atomic, filter, update} from '../library';

interface A {
  meta?: {
    date: Date;
    time: Date;
    deep:
      | {
          value: number;
        }
      | {
          values: number[];
        };
  };
  foo: number;
  objects: {
    bar: string;
    pia: number;
  }[];
}

update<A>({
  $currentDate: {
    meta: {
      date: true,
      time: {$type: 'date'},
    },
  },
  $inc: {
    foo: 1,
  },
  $min: {
    foo: 2,
  },
  $max: {
    objects: {
      $: {
        bar: 'abc',
      },
    },
  },
  $mul: {
    meta: {
      deep: {
        value: 0,
      },
    },
  },
  $set: {
    meta: {
      // eslint-disable-next-line @mufan/no-object-literal-type-assertion
      deep: atomic({value: 123} as {value: number} | {values: number[]}),
    },
    foo: 123,
    objects: [
      {
        bar: 'abc',
        pia: 123,
      },
    ],
  },
  $setOnInsert: {
    foo: 123,
    objects: {
      $: {
        bar: 'abc',
      },
    },
  },
  $unset: {
    foo: true,
    objects: {
      $: {
        bar: true,
      },
    },
  },
  $addToSet: {
    meta: {
      deep: {
        values: 123,
      },
    },
    objects: atomic({
      bar: 'abc',
      pia: 123,
    }),
  },
  $pop: {
    objects: 1,
  },
  $pull: {
    meta: {
      deep: {
        values: {
          $eq: 123,
        },
      },
    },
    objects: atomic({
      bar: 'abc',
    }),
  },
  $push: {
    objects: atomic({
      bar: 'abc',
      pia: 123,
    }),
  },
  $pullAll: {
    objects: [
      {
        bar: 'abc',
        pia: 123,
      },
    ],
  },
  $bit: {
    foo: {
      and: 1,
    },
  },
});

update<A>({
  $set: {
    objects: {
      0: {
        bar: 'abc',
      },
    },
  },
});

update<A>({
  $pull: {
    objects: filter({
      bar: 'abc',
    }),
  },
});

update<A>({
  $currentDate: {
    meta: {
      // @ts-expect-error
      date: {
        $type: 'timestamp',
      },
    },
  },
});

update<A>({
  $pull: {
    objects: filter({
      // @ts-expect-error
      baz: 'abc',
    }),
  },
});

update<A>({
  $currentDate: {
    meta: {
      // @ts-expect-error
      date: false,
    },
  },
  $inc: {
    // @ts-expect-error
    foo: '1',
  },
  $min: {
    // @ts-expect-error
    foo: '2',
  },
  $max: {
    // @ts-expect-error
    objects: {
      $: {
        bar: 123,
      },
    },
  },
  $mul: {
    meta: {
      deep: {
        // @ts-expect-error
        values: 0,
      },
    },
  },
  $set: {
    // @ts-expect-error
    foo: {},
    // @ts-expect-error
    objects: {bar: 'abc'},
  },
  $setOnInsert: {
    // @ts-expect-error
    foo: '123',
    objects: {
      0: {
        bar: 'abc',
      },
    },
  },
  $unset: {
    // @ts-expect-error
    foo: false,
    objects: {
      $: {
        // @ts-expect-error
        bar: 'true',
      },
    },
  },
  $addToSet: {
    meta: {
      deep: {
        // @ts-expect-error
        value: 123,
      },
    },
    objects: {
      // @ts-expect-error
      bar: 'abc',
      pia: 123,
    },
  },
  $pop: {
    // @ts-expect-error
    foo: 1,
  },
  $pull: {
    meta: {
      deep: {
        values: {
          // @ts-expect-error
          $elemMatch: {
            $eq: 123,
          },
        },
      },
    },
  },
  $push: {
    objects: {
      // @ts-expect-error
      bar: 'abc',
      pia: 123,
    },
  },
  $pullAll: {
    objects: {
      // @ts-expect-error
      bar: 'abc',
      pia: 123,
    },
  },
  $bit: {
    foo: {
      // @ts-expect-error
      and: 'abc',
    },
  },
});
