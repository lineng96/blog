import { defineConfig } from 'vitepress'

export default defineConfig({

  head: [
    ['link', { rel: 'icon', href: 'https://cos.lineng.club/favicon.ico' }]
  ],

  srcDir: 'logs',
  base: '/',
  

  title: 'Mr.Li Blog',
  description: 'This is my Blog.',


  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
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