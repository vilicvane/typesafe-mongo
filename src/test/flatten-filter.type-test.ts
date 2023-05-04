import type {Collection} from 'mongodb';
import {ObjectId} from 'mongodb';

import {atomic, filter} from '../library';

interface A {
  _id: ObjectId;
  foo: string;
  bar?: {
    pia: number;
    hia: boolean;
  };
}

declare const collectionA: Collection<A>;

collectionA.find(filter({_id: new ObjectId(), foo: {$eq: 'abc'}}));
// @ts-expect-error
collectionA.find(filter({foo: {$eq: 123}}));

filter<A>({_id: new ObjectId(), foo: {$eq: 'abc'}});
// @ts-expect-error
filter<A>({foo: {$eq: 123}});
filter<A>({bar: {$eq: {pia: 123, hia: true}}});
filter<A>({bar: {pia: 123}});
filter<A>({bar: {pia: {$eq: 123}}});
// @ts-expect-error
filter<A>({bar: {pia: {$eq: 'abc'}}});
filter<A>({bar: atomic({pia: 123, hia: true})});
// @ts-expect-error
filter<A>({bar: atomic({pia: 123})});
// @ts-expect-error
filter<A>({bar: {pia: 'abc'}});
// @ts-expect-error
filter<A>({bar: atomic({pia: 'abc'})});

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

declare const collectionB: Collection<B>;

collectionB.find(filter({texts: {$eq: 'abc'}}));

filter<B>({texts: {$eq: 'abc'}});
filter<B>({texts: 'abc'});
filter<B>({objects: {$elemMatch: {bar: 123}}});
filter<B>({objects: {$elemMatch: {pia: {x: 'abc', y: 'def'}}}});
filter<B>({
  objects: {
    $elemMatch: filter<B['objects'][number]>({
      pia: {x: 'abc', y: 'def'},
    }),
  },
});
filter<B>({
  objects: {
    $elemMatch: {
      pia: {x: 'abc', y: 'def'},
    },
  },
});
filter<B>({
  objects: {
    0: {
      bar: 123,
    },
  },
});
