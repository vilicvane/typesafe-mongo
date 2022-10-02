import {ObjectId} from 'mongodb';

import {atomic, flattenFilter} from '../library';

test('simple', () => {
  const id_1 = new ObjectId();

  expect(
    flattenFilter<object>({
      foo: {$eq: 'abc'},
      bar: {
        pia: 123,
      },
    }),
  ).toEqual({
    foo: {$eq: 'abc'},
    'bar.pia': 123,
  });

  expect(
    flattenFilter<object>({
      bar: {
        pia: {$gt: 0},
      },
    }),
  ).toEqual({
    'bar.pia': {$gt: 0},
  });

  expect(
    flattenFilter<object>({
      _id: id_1,
      foo: {$eq: 'abc'},
    }),
  ).toEqual({
    _id: id_1,
    foo: {$eq: 'abc'},
  });

  expect(
    flattenFilter<object>({
      bar: {$eq: {pia: 123, hia: true}},
    }),
  ).toEqual({
    bar: {$eq: {pia: 123, hia: true}},
  });

  expect(
    flattenFilter<object>({
      bar: atomic({pia: 123, hia: true}),
    }),
  ).toEqual({
    bar: {pia: 123, hia: true},
  });

  expect(
    flattenFilter<object>({
      bar: {pia: 123, hia: true},
    }),
  ).toEqual({
    'bar.pia': 123,
    'bar.hia': true,
  });

  expect(
    flattenFilter<object>({
      bar: {pia: {x: 123, y: {$eq: 456}}, hia: true},
    }),
  ).toEqual({
    'bar.pia.x': 123,
    'bar.pia.y': {$eq: 456},
    'bar.hia': true,
  });
});
