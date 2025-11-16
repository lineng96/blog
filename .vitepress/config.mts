import { defineConfig } from 'vitepress'

export default defineConfig({

  head: [
    ['link', { rel: 'icon', href: 'https://cos.lineng.club/favicon.ico' }],
    ['meta', { name: 'algolia-site-verification', content: '8320170770656D80' }]
  ],

  srcDir: 'logs',
  base: '/',
  

  title: 'Mr.Li',
  description: 'This is my Blog.',


  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})