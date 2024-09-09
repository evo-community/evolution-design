import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { AbstractionInstance } from 'evolution-design/types'
import { abstraction } from '../../config'
import { Vfs } from '../vfs'
import { buildAbstractionInstance } from './build-abstraction-instance'

describe('createVfsRoot', () => {
  it('allows adding files and creates folders automatically', () => {
    const project = join('/', 'project')
    const indexFile = join('/', 'project', 'index.ts')
    const usersIndex = join('/', 'project', 'features', 'user', 'index.ts')
    const usersUi = join('/', 'project', 'features', 'user', 'ui.tsx')
    const mapIndex = join('/', 'project', 'features', 'map', 'index.ts')
    const mapUi = join('/', 'project', 'features', 'map', 'ui.tsx')
    const sharedUiButton = join('/', 'project', 'shared', 'ui', 'button.tsx')

    const vfs = new Vfs(project)
    vfs.addFile(usersIndex)
    vfs.addFile(usersUi)
    vfs.addFile(mapIndex)
    vfs.addFile(mapUi)
    vfs.addFile(sharedUiButton)
    vfs.addFile(indexFile)
    vfs.addFile(join(project, '1.service', 'service.ts'))
    vfs.addFile(join(project, '2.service', 'service.ts'))
    vfs.addFile(join(project, 'services', '3.service', 'service.ts'))

    const service = abstraction('service')
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
        features,
        shared,
        '**/*.service': service,
      },
    })

    const result = buildAbstractionInstance(app, vfs.root)

    expect(result).toEqual({
      path: project,
      abstraction: app,
      childNodes: [join(project, 'services'), indexFile],
      children: [
        {
          path: join(project, 'features'),
          abstraction: features,
          childNodes: [],
          children: [
            {
              path: join(project, 'features', 'map'),
              abstraction: feature,
              childNodes: [mapUi, mapIndex],
              children: [],
            },
            {
              path: join(project, 'features', 'user'),
              abstraction: feature,
              childNodes: [usersUi, usersIndex],
              children: [],
            },
          ],
        },
        {
          path: join(project, 'shared'),
          abstraction: shared,
          childNodes: [join(project, 'shared', 'ui'), sharedUiButton],
          children: [],
        },
        {
          path: join(project, 'services', '3.service'),
          abstraction: service,
          childNodes: [join(project, 'services', '3.service', 'service.ts')],
          children: [],
        },
        {
          path: join(project, '2.service'),
          abstraction: service,
          childNodes: [join(project, '2.service', 'service.ts')],
          children: [],
        },
        {
          path: join(project, '1.service'),
          abstraction: service,
          childNodes: [join(project, '1.service', 'service.ts')],
          children: [],
        },
      ],
    } satisfies AbstractionInstance)
  })
})
