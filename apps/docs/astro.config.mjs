// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  base: "/",
  integrations: [
    starlight({
      title: "Evolution Design",
      logo: {
        src: "./src/assets/logo.png",
        alt: "ED",
      },
      social: {
        github: "https://github.com/evo-community/evolution-design",
        telegram: "https://t.me/+VugvWY1dtdRhM2Uy",
      },
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
      defaultLocale: "root",
      locales: {
        root: {
          label: "Russian",
          lang: "ru",
        },
        en: {
          label: "English",
        },
      },
      sidebar: [
        {
          label: "Начало",
          translations: {
            en: "Getting started",
          },
          slug: "getting-started",
        },
        {
          label: "Руководство",
          translations: {
            en: "Handbook",
          },
          items: [
            {
              label: "Быстрый старт",
              slug: "guide",
              translations: {
                en: "Quick start",
              },
            },
            {
              label: "Создание проекта на ED small",
              slug: "guide/ed-small",
              translations: {
                en: "Creating a project on ED small",
              },
            },
          ],
        },
        {
          label: "Погружение",
          translations: {
            en: "Deep dive",
          },
          items: [
            {
              label: "Основные концепции",
              slug: "deep-dive",
              translations: {
                en: "Main concepts",
              },
            },
          ],
        },
        {
          label: "Паттерны",
          translations: {
            en: "Patterns",
          },
          items: [],
        },
        {
          label: "Глоссарий",
          translations: {
            en: "Terms",
          },
          items: [],
        },
      ],
    }),
  ],
});
