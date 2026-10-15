import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  srcExclude: ['api/**'],
  title: 'Ultimate TS',
  description: 'Production-ready TypeScript template with strict quality gates',
  // English pages live in docs/, Polish pages with the same names in docs/pl/.
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [{ text: 'Home', link: '/' }],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting started', link: '/getting-started' },
              { text: 'Quality gates', link: '/quality-gates' },
              { text: 'Scripts', link: '/scripts' },
              { text: 'Tools', link: '/tools' },
            ],
          },
          {
            text: 'AI agents',
            items: [
              { text: 'AI workflow', link: '/ai-workflow' },
              { text: 'Edge cases: greeting', link: '/edge-cases/greeting' },
            ],
          },
        ],
      },
    },
    pl: {
      label: 'Polski',
      lang: 'pl',
      link: '/pl/',
      themeConfig: {
        nav: [{ text: 'Start', link: '/pl/' }],
        sidebar: [
          {
            text: 'Przewodnik',
            items: [
              { text: 'Pierwsze kroki', link: '/pl/getting-started' },
              { text: 'Bramki jakości', link: '/pl/quality-gates' },
              { text: 'Skrypty', link: '/pl/scripts' },
              { text: 'Narzędzia', link: '/pl/tools' },
            ],
          },
          {
            text: 'Agenci AI',
            items: [
              { text: 'Praca z agentami AI', link: '/pl/ai-workflow' },
              // The example edge case list exists in English only.
              { text: 'Edge cases: greeting (EN)', link: '/edge-cases/greeting' },
            ],
          },
        ],
      },
    },
  },
});
