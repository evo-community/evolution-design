export function memoize<T extends (arg: any) => any>(fn: T): T {
  const cache = new Map()
  return function (this: any, arg: any) {
    if (cache.has(arg)) {
      return cache.get(arg)
    }
    const result = fn.apply(this, arg)
    cache.set(arg, result)
    return result
  } as T
}
