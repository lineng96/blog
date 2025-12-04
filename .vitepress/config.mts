import { defineConfig } from 'vitepress'
export default defineConfig({

    head: [
        ['link', { rel: 'icon', href: 'https://cos.lineng.club/favicon.ico' }],
        ['meta', { name: 'algolia-site-verification', content: '39A61361F1177DAC' }],
        ['script', { async: 'true', src: 'https://www.googletagmanager.com/gtag/js?id=G-LTWPQ8DCVK' }],
        ['script', {}, `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LTWPQ8DCVK');
        `],
    ],

    srcDir: 'logs',
    base: '/',


    title: 'Mr.Li',
    description: 'This is my Blog.',
    lastUpdated: true,
    markdown: {
        math: true,
        lineNumbers: true,
        image: {
            lazyLoading: true
        }
    },


    themeConfig: {
        outline: 'deep',
        algolia: {
            appId: '1F2O70Q85Y',
            apiKey: '09aac637bd714f08f64d6394d3741cd5',
            indexName: 'liblog233',
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about' }
        ],
        lastUpdatedText: '最后更新',

        sidebar: {
            //  Java 分组侧边栏
            '/java/': [
                {
                    text: 'Java',
                    items: [
                        { text: 'JVM 体系结构', link: '/java/JVM-Architecture' },
                        { text: 'HashMap', link: '/java/HashMap' },
                    ]
                }
            ],

            // 新增 算法导论 分组侧边栏
            '/IntroductionToAlgorithms/': [
                {
                    text: '算法导论',
                    items: [
                        { text: '序', link: '/IntroductionToAlgorithms/index' },
                        { text: '第一章：算法在计算中的作用', link: '/IntroductionToAlgorithms/The-Role-of-Algorithms-in-Computing' },
                        { text: '第二章：算法基础', link: '/IntroductionToAlgorithms/Getting-Started' },
                        { text: '第三章：函数的增长', link: '/IntroductionToAlgorithms/Characterizing-Running-Times' }
                    ]
                }
            ],

            // 新增 LeetCode 分组侧边栏
            '/LeetCode/': [
                {
                    text: 'LeetCode',
                    items: [
                        { text: '1', link: '/leetcode/java/1-5' },
                        { text: '2', link: '/leetcode/' },
                    ]
                }
            ]
        },
    }
})