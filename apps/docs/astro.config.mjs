// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  base: '/',
  integrations: [
    starlight({
      title: 'EVOLUTION DESIGN',
      social: {
        github: 'https://github.com/evo-community/evolution-design',
      },
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/custom.css',
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Russian',
          lang: 'ru'
        },
        en: {
          label: 'English',
        }
      },
      sidebar: [
        {
          label: 'Руководство',
          translations: {
            'en': 'Guide'
          },
          items: [
            { 
              label: 'Начало работы', 
              slug: 'guide',
              translations: {
                'en': 'Getting started'
              },
            },
            { 
              label: 'Файл конфигурации', 
              slug: 'guide/config',
              translations: {
                'en': 'Config'
              },
            },
          ],
        },
      ],
    }),
  ],
})
