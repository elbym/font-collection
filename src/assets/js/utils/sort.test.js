import { expect, test } from 'vitest';
import { order } from './sort.js';

const nodes = [
  { title: 'b', year: 2001 },
  { title: 'a', year: null },
  { title: 'c', year: 1549 },
  { title: 'd', year: 2001 },
];

test('A–Z, Jahr aufsteigend/absteigend, ohne Jahr ans Ende', () => {
  expect(order(nodes, '')).toEqual([1, 0, 2, 3]);
  expect(order(nodes, 'alt')).toEqual([2, 0, 3, 1]);
  expect(order(nodes, 'neu')).toEqual([0, 3, 2, 1]);
});
