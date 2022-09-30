import {ObjectId} from 'mongodb';

import {atomic, flattenFilter} from '../library';

interface A {
  _id: ObjectId;
  foo: string;
  bar?: {
    pia: number;
    hia: boolean;
  };
}

flattenFilter<A>({_id: new ObjectId(), foo: {$eq: 'abc'}});
// @ts-expect-error
flattenFilter<A>({foo: {$eq: 123}});
flattenFilter<A>({bar: {$eq: {pia: 123, hia: true}}});
flattenFilter<A>({bar: {pia: 123}});
flattenFilter<A>({bar: {pia: {$eq: 123}}});
// @ts-expect-error
flattenFilter<A>({bar: {pia: {$eq: 'abc'}}});
flattenFilter<A>({bar: atomic({pia: 123, hia: true})});
// @ts-expect-error
flattenFilter<A>({bar: atomic({pia: 123})});
// @ts-expect-error
flattenFilter<A>({bar: {pia: 'abc'}});
// @ts-expect-error
flattenFilter<A>({bar: atomic({pia: 'abc'})});

interface B {
  foo: string;
  texts?: string[];
  objects: {
    bar: number;
    pia?: {
      x: string;
      y: string;
    }[];
  }[];
}

flattenFilter<B>({texts: {$eq: 'abc'}});
flattenFilter<B>({texts: 'abc'});
flattenFilter<B>({objects: {$elemMatch: {bar: 123}}});
// @ts-expect-error
flattenFilter<B>({objects: {$elemMatch: {pia: {x: 'abc', y: 'def'}}}});
flattenFilter<B>({
  objects: {
    $elemMatch: flattenFilter<B['objects'][number]>({
      pia: {x: 'abc', y: 'def'},
    }),
  },
});
