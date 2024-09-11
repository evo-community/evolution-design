const hasOwn = Object.prototype.hasOwnProperty
const is = Object.is

export function shallowEqual(
  objectA: any,
  objectB: any,
): boolean {
  if (objectA === objectB) {
    return true
  }
  if (typeof objectA !== 'object' || objectA === null) {
    return false
  }
  if (typeof objectB !== 'object' || objectB === null) {
    return false
  }

  const keysA = Object.keys(objectA)
  const keysB = Object.keys(objectB)

  if (keysA.length !== keysB.length) {
    return false
  }

  const isEqual
    = is

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!hasOwn.call(objectB, key) || !isEqual(objectA[key], objectB[key])) {
      return false
    }
  }

  return true
}
