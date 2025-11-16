import { defineConfig } from 'vitepress'

export default defineConfig({

  head: [
    ['link', { rel: 'icon', href: 'https://cos.lineng.club/favicon.ico' }],
    ['meta', { name: 'algolia-site-verification', content: '39A61361F1177DAC' }]
  ],

  srcDir: 'logs',
  base: '/',
  

  title: 'Mr.Li',
  description: 'This is my Blog.',
  lang: 'zh-CN',


  themeConfig: {
    algolia: {
      appId: 'Y84O4HB312',
      apiKey: '5539272e6217f9af24c8b56147ca483e',
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