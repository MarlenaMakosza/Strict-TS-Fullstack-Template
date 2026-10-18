import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  // GitHub Pages serves the site under /<repository>/; the Docs workflow sets DOCS_BASE.
  base: process.env['DOCS_BASE'] ?? '/',
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
              { text: 'Code review', link: '/code-review' },
              { text: 'To do', link: '/todo' },
              {
                text: 'Coding conventions',
                link: '/architecture/08-crosscutting-concepts-and-conventions',
              },
            ],
          },
          {
            text: 'Architecture (arc42)',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/architecture/' },
              { text: '1. Introduction and goals', link: '/architecture/01-introduction-goals' },
              { text: '2. Constraints', link: '/architecture/02-constraints' },
              { text: '3. Context and scope', link: '/architecture/03-context-scope' },
              { text: '4. Solution strategy', link: '/architecture/04-solution-strategy' },
              { text: '5. Building blocks', link: '/architecture/05-building-blocks' },
              { text: '6. Runtime view', link: '/architecture/06-runtime-view' },
              { text: '7. Deployment view', link: '/architecture/07-deployment-view' },
              {
                text: '8. Concepts and conventions',
                link: '/architecture/08-crosscutting-concepts-and-conventions',
              },
              { text: '9. Decisions', link: '/architecture/decisions' },
              { text: '10. Quality requirements', link: '/architecture/10-quality-requirements' },
              { text: '11. Risks', link: '/architecture/11-risks' },
              { text: '12. Glossary', link: '/architecture/12-glossary' },
            ],
          },
          {
            text: 'AI agents',
            items: [
              { text: 'AI workflow', link: '/ai-workflow' },
              { text: 'UX: greeting page', link: '/ux/greeting' },
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
              { text: 'Code review', link: '/pl/code-review' },
              { text: 'Do zrobienia', link: '/pl/todo' },
              {
                text: 'Konwencje kodu',
                link: '/pl/architecture/08-crosscutting-concepts-and-conventions',
              },
            ],
          },
          {
            text: 'Architektura (arc42)',
            collapsed: true,
            items: [
              { text: 'Przegląd', link: '/pl/architecture/' },
              { text: '1. Wprowadzenie i cele', link: '/pl/architecture/01-introduction-goals' },
              { text: '2. Ograniczenia', link: '/pl/architecture/02-constraints' },
              { text: '3. Kontekst i zakres', link: '/pl/architecture/03-context-scope' },
              { text: '4. Strategia rozwiązania', link: '/pl/architecture/04-solution-strategy' },
              { text: '5. Bloki budulcowe', link: '/pl/architecture/05-building-blocks' },
              { text: '6. Widok czasu działania', link: '/pl/architecture/06-runtime-view' },
              { text: '7. Widok wdrożenia', link: '/pl/architecture/07-deployment-view' },
              {
                text: '8. Koncepcje i konwencje',
                link: '/pl/architecture/08-crosscutting-concepts-and-conventions',
              },
              { text: '9. Decyzje', link: '/pl/architecture/decisions' },
              {
                text: '10. Wymagania jakościowe',
                link: '/pl/architecture/10-quality-requirements',
              },
              { text: '11. Ryzyka', link: '/pl/architecture/11-risks' },
              { text: '12. Słownik', link: '/pl/architecture/12-glossary' },
            ],
          },
          {
            text: 'Agenci AI',
            items: [
              { text: 'Praca z agentami AI', link: '/pl/ai-workflow' },
              // The example UX design and edge case list exist in English only.
              { text: 'UX: greeting page (EN)', link: '/ux/greeting' },
              { text: 'Edge cases: greeting (EN)', link: '/edge-cases/greeting' },
            ],
          },
        ],
      },
    },
  },
});
