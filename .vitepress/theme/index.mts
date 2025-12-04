// .vitepress/theme/index.ts

import DefaultTheme from 'vitepress/theme'
import './style.css' // ✅ 在这里导入是正确的！它相对于主题目录。

export default {
    ...DefaultTheme,
}