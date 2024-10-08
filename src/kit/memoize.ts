export function memoize<T extends (arg: any) => any>(fn: T): T {
  const cache = new WeakMap()
  return function (this: any, arg: any) {
    if (cache.has(arg)) {
      return cache.get(arg)
    }
    const result = fn.call(this, arg)

    cache.set(arg, result)
    return result
  } as T
}
