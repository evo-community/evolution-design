import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Vfs } from './vfs'

describe('createVfsRoot', () => {
  it('allows adding files and creates folders automatically', () => {
    const vfs = new Vfs(join('/', 'project', 'src'))

    expect(vfs.root).toEqual({ type: 'folder', path: join('/', 'project', 'src'), children: [] })

    vfs.addFile(join('/', 'project', 'src', 'index.ts'))
    vfs.addFile(join('/', 'project', 'src', 'components', 'button.ts'))
    vfs.addFile(join('/', 'project', 'src', 'components', 'input.ts'))
    vfs.addFile(join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs.root).toEqual({
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

  it('allows removing files and deletes empty folders automatically', () => {
    const vfs = new Vfs(join('/', 'project', 'src'))

    vfs.addFile(join('/', 'project', 'src', 'index.ts'))
    vfs.addFile(join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs.root).toEqual({
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

    vfs.removeFile(join('/', 'project', 'src', 'components', 'input', 'styles.ts'))

    expect(vfs.root).toEqual({
      type: 'folder',
      path: join('/', 'project', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project', 'src', 'index.ts'),
        },
      ],
    })

    vfs.removeFile(join('/', 'project', 'src', 'index.ts'))

    expect(vfs.root).toEqual({ type: 'folder', path: join('/', 'project', 'src'), children: [] })
  })

  it('allows tracking two separate roots independently', () => {
    const root1 = new Vfs(join('/', 'project1', 'src'))
    const root2 = new Vfs(join('/', 'project2', 'src'))

    root1.addFile(join('/', 'project1', 'src', 'index.ts'))

    expect(root1.root).toEqual({
      type: 'folder',
      path: join('/', 'project1', 'src'),
      children: [
        {
          type: 'file',
          path: join('/', 'project1', 'src', 'index.ts'),
        },
      ],
    })
    expect(root2.root).toEqual({
      type: 'folder',
      path: join('/', 'project2', 'src'),
      children: [],
    })

    root2.addFile(join('/', 'project2', 'src', 'shared', 'ui', 'button.ts'))

    expect(root2.root).toEqual({
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
