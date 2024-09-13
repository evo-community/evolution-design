import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { addDirectory } from './add-directory'
import { addFile } from './add-file'
import { createVfsRoot } from './create-root'
import { removeNode } from './remove-node'

describe('vfs root', () => {
  it('allows adding files and creates folders automatically', () => {
    let vfs = createVfsRoot(join('/', 'project', 'src'))

    expect(vfs).toEqual({ type: 'folder', path: join('/', 'project', 'src'), children: [] })

    vfs = addFile(vfs, join('/', 'project', 'src', 'index.ts'))
    vfs = addFile(vfs, join('/', 'project', 'src', 'components', 'button.ts'))
    vfs = addFile(vfs, join('/', 'project', 'src', 'components', 'input.ts'))
    vfs = addFile(vfs, join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project', 'src', 'index.ts'),
        },
        {
          type: 'folder',
          path: join('/', 'project', 'src', 'components'),
          children: [
            {
              type: 'file',
              path: join('/', 'project', 'src', 'components', 'button.ts'),
            },
            {
              type: 'file',
              path: join('/', 'project', 'src', 'components', 'input.ts'),
            },

            {
              type: 'folder',
              path: join('/', 'project', 'src', 'components', 'input'),
              children: [
                {
                  type: 'file',
                  path: join('/', 'project', 'src', 'components', 'input', 'styles.ts'),
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it('allows add directory', () => {
    let vfs = createVfsRoot(join('/', 'project', 'src'))

    vfs = addDirectory(vfs, join('/', 'project', 'src', 'components', 'ui'))

    expect(vfs).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'folder',
          path: join('/', 'project', 'src', 'components'),
          children: [
            {
              type: 'folder',
              path: join('/', 'project', 'src', 'components', 'ui'),
              children: [],
            },
          ],
        },
      ],
    })
  })

  it('allows removing files', () => {
    let vfs = createVfsRoot(join('/', 'project', 'src'))

    vfs = addFile(vfs, join('/', 'project', 'src', 'index.ts'))
    vfs = addFile(vfs, join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project', 'src', 'index.ts'),
        },
        {
          type: 'folder',
          path: join('/', 'project', 'src', 'components'),
          children: [
            {
              type: 'folder',
              path: join('/', 'project', 'src', 'components', 'input'),
              children: [
                {
                  type: 'file',
                  path: join('/', 'project', 'src', 'components', 'input', 'styles.ts'),
                },
              ],
            },
          ],
        },
      ],
    })

    vfs = removeNode(vfs, join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project', 'src', 'index.ts'),
        },
        {
          type: 'folder',
          path: join('/', 'project', 'src', 'components'),
          children: [
            {
              type: 'folder',
              path: join('/', 'project', 'src', 'components', 'input'),
              children: [],
            },
          ],
        },
      ],
    })

    vfs = removeNode(vfs, join('/', 'project', 'src', 'index.ts'))

    expect(vfs).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'folder',
          path: join('/', 'project', 'src', 'components'),
          children: [
            {
              type: 'folder',
              path: join('/', 'project', 'src', 'components', 'input'),
              children: [],
            },
          ],
        },
      ],
    })
  })

  it('allows tracking two separate roots independently', () => {
    let vfs1 = createVfsRoot(join('/', 'project1', 'src'))
    let vfs2 = createVfsRoot(join('/', 'project2', 'src'))

    vfs1 = addFile(vfs1, join('/', 'project1', 'src', 'index.ts'))

    expect(vfs1).toEqual({
      type: 'folder',
      path: join('/', 'project1', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project1', 'src', 'index.ts'),
        },
      ],
    })
    expect(vfs2).toEqual({
      type: 'folder',
      path: join('/', 'project2', 'src'),
      children: [],
    })

    vfs2 = addFile(vfs2, join('/', 'project2', 'src', 'shared', 'ui', 'button.ts'))

    expect(vfs2).toEqual({
      type: 'folder',
      path: join('/', 'project2', 'src'),
      children: [
        {
          type: 'folder',
          path: join('/', 'project2', 'src', 'shared'),
          children: [
            {
              type: 'folder',
              path: join('/', 'project2', 'src', 'shared', 'ui'),
              children: [
                {
                  type: 'file',
                  path: join('/', 'project2', 'src', 'shared', 'ui', 'button.ts'),
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
