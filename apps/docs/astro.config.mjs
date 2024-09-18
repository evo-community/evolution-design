// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  base: '/',
  integrations: [
    starlight({
      title: 'EVOLUTION-DESIGN',
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      locales: {
        en: {
          label: 'English',
        },
        ru: {
          label: 'Russian',
        },
      },
      defaultLocale: 'ru',
      sidebar: [
        {
          label: 'Начало работы',
          items: [
            { label: 'Начало работы', slug: 'getting-started/introduction' },
            { label: 'CLI', slug: 'cli/example' },
          ],
        },
      ],
    }),
  ],
})
