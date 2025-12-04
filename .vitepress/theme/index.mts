// .vitepress/theme/index.ts

import DefaultTheme from 'vitepress/theme'
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import './style.css'

export default {
    ...DefaultTheme,
    setup() {
        const {frontmatter} = useData();
        const route = useRoute();
        giscusTalk({
                repo: 'lineng96/blog',
                repoId: 'R_kgDOQWSAVg',
                category: 'Ideas',
                categoryId: 'DIC_kwDOQWSAVs4Cx33r',
                mapping: 'pathname',
            }, {
                frontmatter, route
            },
            true
        );
    }
}