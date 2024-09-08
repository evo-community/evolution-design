import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { AbstractionInstances } from 'evolution-design/types'
import { abstraction } from '../config'
import { buildAbstractions } from './build-abstractions'
import { Vfs } from './vfs'

describe('createVfsRoot', () => {
  it('allows adding files and creates folders automatically', () => {
    const project = join('/', 'project')
    const usersIndex = join('/', 'project', 'features', 'user', 'index.ts')
    const usersUi = join('/', 'project', 'features', 'user', 'ui.tsx')
    const mapIndex = join('/', 'project', 'features', 'map', 'index.ts')
    const mapUi = join('/', 'project', 'features', 'map', 'ui.tsx')
    const sharedUi = join('/', 'project', 'shared', 'ui', 'button.tsx')

    const vfs = new Vfs(project)
    vfs.addFile(usersIndex)
    vfs.addFile(usersUi)
    vfs.addFile(mapIndex)
    vfs.addFile(mapUi)
    vfs.addFile(sharedUi)

    const feature = abstraction('feature')
    const shared = abstraction('shared')
    const features = abstraction({
      name: 'features',
      children: {
        '*': feature,
      },
    })

    const app = abstraction({
      name: 'app',
      children: {
        './features': features,
        './shared': shared,
      },
    })

    const result = buildAbstractions({
      abstraction: app,
      instances: {},
      root: vfs.root,
    })

    expect(result).toEqual({
      [usersIndex]: {
        abstraction: feature,
        path: usersIndex,
        abstractionsPath: [
          { abstraction: app, path: project },
          { abstraction: features, path: join(project, 'features') },
          { abstraction: feature, path: join(project, 'features', 'user') },
        ],
      },
      [usersUi]: {
        abstraction: feature,
        path: usersUi,
        abstractionsPath: [
          { abstraction: app, path: project },
          { abstraction: features, path: join(project, 'features') },
          { abstraction: feature, path: join(project, 'features', 'user') },
        ],
      },
      [mapIndex]: {
        abstraction: feature,
        path: mapIndex,
        abstractionsPath: [
          { abstraction: app, path: project },
          { abstraction: features, path: join(project, 'features') },
          { abstraction: feature, path: join(project, 'features', 'map') },
        ],
      },
      [mapUi]: {
        abstraction: feature,
        path: mapUi,
        abstractionsPath: [
          { abstraction: app, path: project },
          { abstraction: features, path: join(project, 'features') },
          { abstraction: feature, path: join(project, 'features', 'map') },
        ],
      },
      [sharedUi]: {
        abstraction: shared,
        path: sharedUi,
        abstractionsPath: [
          { abstraction: app, path: project },
          { abstraction: shared, path: join(project, 'shared') },
        ],
      },
    } satisfies AbstractionInstances)
  })
})
