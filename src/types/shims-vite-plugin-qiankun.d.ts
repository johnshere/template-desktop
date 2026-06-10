// vite-plugin-qiankun 的类型导出在某些版本里不完整，这里手动补一份
declare module 'vite-plugin-qiankun' {
    import type { Plugin } from 'vite'
    export default function qiankun(microName: string, options: { useDevMode?: boolean }): Plugin
}
