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
    algolia: {
      appId: '3CDSUT4O96', 
      apiKey: 'd0f1e4e75fcf6a70a12916b22da86fa9', 
      indexName: 'lineng_club_3cdsut4o96_pages', 
    },
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