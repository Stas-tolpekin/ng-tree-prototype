export function countIterable<T>(iterable: Generator<T>, predicate: (item: T) => boolean): number {
  let checkedCount = 0;
  for (const item of iterable) {
    if (predicate(item)) {
      checkedCount++;
    }
  }
  return checkedCount;
}

export function reduceIterable<R, T>(iterable: Generator<T>, process: (prev: R, item: T) => R, init: R): R {
  let result: R = init;
  for (const item of iterable) {
    result = process(result, item);
  }
  return result;
}