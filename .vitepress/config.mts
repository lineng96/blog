import { defineConfig } from 'vitepress'

export default defineConfig({

  head: [
    ['link', { rel: 'icon', href: 'https://cos.lineng.club/favicon.ico' }],
    ['meta', { name: 'algolia-site-verification', content: '2BBDFAB0456EC97C' }]
  ],

  srcDir: 'logs',
  base: '/',
  

  title: 'Mr.Li',
  description: 'This is my Blog.',


  themeConfig: {
    algolia: {
      appId: 'OFTORGA22L', 
      apiKey: '3568ca4037f9b03034f23ac03f481759', 
      indexName: 'liblog233', 
      
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