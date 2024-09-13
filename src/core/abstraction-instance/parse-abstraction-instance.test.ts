import type { AbstractionInstance } from './types'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { abstraction } from '../abstraction'
import { addFile } from '../vfs/add-file'
import { createVfsRoot } from '../vfs/create-root'
import { parseAbstractionInstance } from './parse-abstraction-instance'

describe('parseAbstractionInstance', () => {
  it('return abstraction instance from vfs and abstraction', () => {
    const project = join('/', 'project')
    const indexFile = join('/', 'project', 'index.ts')
    const usersIndex = join('/', 'project', 'features', 'user', 'index.ts')
    const usersUi = join('/', 'project', 'features', 'user', 'ui.tsx')
    const mapIndex = join('/', 'project', 'features', 'map', 'index.ts')
    const mapUi = join('/', 'project', 'features', 'map', 'ui.tsx')
    const sharedUiButton = join('/', 'project', 'shared', 'ui', 'button.tsx')

    let vfs = createVfsRoot(project)

    vfs = addFile(vfs, usersIndex)
    vfs = addFile(vfs, usersUi)
    vfs = addFile(vfs, mapIndex)
    vfs = addFile(vfs, mapUi)
    vfs = addFile(vfs, sharedUiButton)
    vfs = addFile(vfs, indexFile)
    vfs = addFile(vfs, join(project, '1.service', 'service.ts'))
    vfs = addFile(vfs, join(project, '2.service', 'service.ts'))
    vfs = addFile(vfs, join(project, 'services', '3.service', 'service.ts'))

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

    const result = parseAbstractionInstance(app)(vfs)

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

  it('allow redeclare abstractions by underlaying abstractions', () => {
    const projectPath = join('/', 'project')
    const file1Path = join('/', 'project', 'file1.ts')
    const mapIndexPath = join('/', 'project', 'map', 'index.ts')

    let vfs = createVfsRoot(projectPath)

    vfs = addFile(vfs, file1Path)
    vfs = addFile(vfs, mapIndexPath)

    const other = abstraction('other')
    const map = abstraction('map')

    const app = abstraction({
      name: 'app',
      children: {
        '*': other,
        'map': map,
      },
    })

    const result = parseAbstractionInstance(app)(vfs)

    expect(result).toEqual({
      path: projectPath,
      abstraction: app,
      childNodes: [],
      children: [
        {
          path: join(projectPath, 'map'),
          abstraction: map,
          childNodes: [mapIndexPath],
          children: [],
        },
        {
          path: file1Path,
          abstraction: other,
          childNodes: [],
          children: [],
        },

      ],
    } satisfies AbstractionInstance)
  })
})
