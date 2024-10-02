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
          lang: 'ru',
        },
        en: {
          label: 'English',
        },
      },
      sidebar: [
        {
          label: 'Почему Evolution Design?',
          translations: {
            en: 'Why Evolution Design?',
          },
          items: [
            {
              label: 'Проблема',
              slug: 'why',
              translations: {
                en: 'Problem',
              },
            },
            {
              label: 'Решение',
              slug: 'why/resolve',
              translations: {
                en: 'Problem resolve',
              },
            },
          ],
        },
        {
          label: 'Руководство',
          translations: {
            en: 'Guide',
          },
          items: [
            {
              label: 'Начало работы',
              slug: 'guide',
              translations: {
                en: 'Getting started',
              },
            },
            {
              label: 'Конфигурация',
              slug: 'guide/config',
              translations: {
                en: 'Configuration',
              },
            },
            {
              label: 'Примеры',
              slug: 'guide/examples',
              translations: {
                en: 'Examples',
              },
            },
          ],
        },
        {
          label: 'Базовые архитектурные понятия',
          translations: {
            en: 'Core architectural concepts',
          },
          items: [
            {
              label: 'Глоссарий',
              slug: 'core-architectural-concepts',
              translations: {
                en: 'Glossary',
              },
            },
          ],
        },
      ],
    }),
  ],
})
