import {flatten} from '../library';

test('basic', () => {
  expect(
    flatten({
      foo: 1,
      bar: {pia: -1},
    }),
  ).toEqual({
    foo: 1,
    'bar.pia': -1,
  });
});
