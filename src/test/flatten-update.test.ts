import {atomic, flattenUpdate} from '../library';

test('simple', () => {
  expect(
    flattenUpdate<object>({
      $currentDate: {
        meta: {
          date: true,
        },
      },
    }),
  ).toEqual({
    $currentDate: {
      'meta.date': true,
    },
  });

  expect(
    flattenUpdate<object>({
      $currentDate: {
        meta: {
          date: {
            $type: 'timestamp',
          },
        },
      },
    }),
  ).toEqual({
    $currentDate: {
      'meta.date': {
        $type: 'timestamp',
      },
    },
  });

  expect(
    flattenUpdate<object>({
      $inc: {
        foo: 1,
      },
    }),
  ).toEqual({
    $inc: {
      foo: 1,
    },
  });

  expect(
    flattenUpdate<object>({
      $min: {
        foo: 2,
      },
    }),
  ).toEqual({
    $min: {
      foo: 2,
    },
  });

  expect(
    flattenUpdate<object>({
      $max: {
        objects: {
          $: {
            bar: 'abc',
          },
        },
      },
    }),
  ).toEqual({
    $max: {
      'objects.$.bar': 'abc',
    },
  });

  expect(
    flattenUpdate<object>({
      $mul: {
        meta: {
          deep: {
            value: 0,
          },
        },
      },
    }),
  ).toEqual({
    $mul: {
      'meta.deep.value': 0,
    },
  });

  expect(
    flattenUpdate<object>({
      $set: {
        foo: 123,
        objects: [{bar: 'abc'}],
      },
    }),
  ).toEqual({
    $set: {
      foo: 123,
      objects: [{bar: 'abc'}],
    },
  });

  expect(
    flattenUpdate<object>({
      $setOnInsert: {
        foo: 123,
        objects: {
          $: {
            bar: 'abc',
          },
        },
      },
    }),
  ).toEqual({
    $setOnInsert: {
      foo: 123,
      'objects.$.bar': 'abc',
    },
  });

  expect(
    flattenUpdate<object>({
      $unset: {
        foo: true,
        objects: {
          $: {
            bar: true,
          },
        },
      },
    }),
  ).toEqual({
    $unset: {
      foo: true,
      'objects.$.bar': true,
    },
  });

  expect(
    flattenUpdate<object>({
      $addToSet: {
        meta: {
          deep: {
            values: 123,
          },
        },
        objects: atomic({
          bar: 'abc',
        }),
      },
    }),
  ).toEqual({
    $addToSet: {
      'meta.deep.values': 123,
      objects: {
        bar: 'abc',
      },
    },
  });

  expect(
    flattenUpdate<object>({
      $pop: {
        objects: 1,
      },
    }),
  ).toEqual({
    $pop: {
      objects: 1,
    },
  });

  expect(
    flattenUpdate<object>({
      $pull: {
        meta: {
          deep: {
            values: {
              $eq: 123,
            },
          },
        },
      },
    }),
  ).toEqual({
    $pull: {
      'meta.deep.values': {
        $eq: 123,
      },
    },
  });

  expect(
    flattenUpdate<object>({
      $push: {
        objects: atomic({
          bar: 'abc',
        }),
      },
    }),
  ).toEqual({
    $push: {
      objects: {
        bar: 'abc',
      },
    },
  });

  expect(
    flattenUpdate<object>({
      $pullAll: {
        objects: [{bar: 'abc'}],
      },
    }),
  ).toEqual({
    $pullAll: {
      objects: [{bar: 'abc'}],
    },
  });

  expect(
    flattenUpdate<object>({
      $bit: {
        deep: {
          value: {
            and: 1,
          },
        },
        foo: {
          and: 1,
        },
      },
    }),
  ).toEqual({
    $bit: {
      'deep.value': {
        and: 1,
      },
      foo: {
        and: 1,
      },
    },
  });
});
