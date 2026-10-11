import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  srcExclude: ['api/**'],
  title: 'Project',
  description: 'Project documentation',
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [],
  },
});
