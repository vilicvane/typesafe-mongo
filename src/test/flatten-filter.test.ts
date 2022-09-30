import {ObjectId} from 'mongodb';

import {atomic, flattenFilter} from '../library';

test('simple', () => {
  const id_1 = new ObjectId();

  expect(
    flattenFilter({
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
    flattenFilter({
      bar: {
        pia: {$gt: 0},
      },
    }),
  ).toEqual({
    'bar.pia': {$gt: 0},
  });

  expect(
    flattenFilter({
      _id: id_1,
      foo: {$eq: 'abc'},
    }),
  ).toEqual({
    _id: id_1,
    foo: {$eq: 'abc'},
  });

  expect(
    flattenFilter({
      bar: {$eq: {pia: 123, hia: true}},
    }),
  ).toEqual({
    bar: {$eq: {pia: 123, hia: true}},
  });

  expect(
    flattenFilter({
      bar: atomic({pia: 123, hia: true}),
    }),
  ).toEqual({
    bar: {pia: 123, hia: true},
  });

  expect(
    flattenFilter({
      bar: {pia: 123, hia: true},
    }),
  ).toEqual({
    'bar.pia': 123,
    'bar.hia': true,
  });

  expect(
    flattenFilter({
      bar: {pia: {x: 123, y: {$eq: 456}}, hia: true},
    }),
  ).toEqual({
    'bar.pia.x': 123,
    'bar.pia.y': {$eq: 456},
    'bar.hia': true,
  });
});
