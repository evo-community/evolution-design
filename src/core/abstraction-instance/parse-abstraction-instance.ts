import type { Abstraction } from '../abstraction'
import type { Path, VfsNode } from '../vfs/types'
import type { AbstractionInstance } from './types'
import { relative } from 'node:path'
import { minimatch } from 'minimatch'
import { memoize } from '../../kit/memoize'

// Так как Vfs иммутабельный,
// то ссылки на инсансы между вызовами
// не будут изменены, благодаря мемоизации
export const parseAbstractionInstance = memoize((abstraction: Abstraction) => memoize((node: VfsNode): AbstractionInstance => {
  if (node.type === 'file') {
    return {
      abstraction,
      path: node.path,
      children: [],
      childNodes: [],
    }
  }

  // Получаем все дочерние абстракции
  const children: Record<Path, AbstractionInstance> = {}

  for (const [pattern, childAbstraction] of Object.entries(abstraction.children)) {
    const nodeAbstractionInstance = parseAbstractionInstance(childAbstraction)
    const nodesStack: VfsNode[] = [node]
    while (nodesStack.length) {
      const currentNode = nodesStack.pop()!
      // Если путь соответствует паттерну. То записываем или **перезаписываем** инстранс абстракции
      if (minimatch(relative(node.path, currentNode.path), pattern)) {
        children[currentNode.path] = nodeAbstractionInstance(currentNode)

        // Внутрь дирректории для которой создали абстракцию не идём
        continue
      }

      // Если для дирректории один из прошлых матчеров создал абстракцию, тоже не идём
      if (children[currentNode.path]) {
        continue
      }

      if (currentNode.type === 'folder') {
        nodesStack.push(...currentNode.children)
      }
    }
  }

  // Получаем все ноды, которые не являются абстракциями
  const childNodes: Path[] = []
  const childrenNodesStack: VfsNode[] = [node]

  while (childrenNodesStack.length) {
    const currentNode = childrenNodesStack.pop()!

    // Если есть абстракция - игнорируем
    if (children[currentNode.path]) {
      continue
    }

    if (currentNode.path !== node.path) {
      childNodes.push(currentNode.path)
    }

    if (currentNode.type === 'folder') {
      childrenNodesStack.push(...currentNode.children)
    }
  }

  return {
    abstraction,
    path: node.path,
    childNodes: Object.values(childNodes),
    children: Object.values(children),
  }
}))
