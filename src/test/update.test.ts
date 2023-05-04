import {atomic, filter, update} from '../library';

test('simple', () => {
  expect(
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
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
    update<object>({
      $pull: {
        meta: filter({
          deep: {
            values: {
              $eq: 123,
            },
          },
        }),
      },
    }),
  ).toEqual({
    $pull: {
      meta: {
        'deep.values': {
          $eq: 123,
        },
      },
    },
  });

  expect(
    update<object>({
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
    update<object>({
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
    update<object>({
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
