import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// vue-router 5 内置约定式路由的 vite 插件（吸收了 unplugin-vue-router）
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VitePluginMetaEnv from 'vite-plugin-meta-env'
import { visualizer } from 'rollup-plugin-visualizer'
import checker from 'vite-plugin-checker'
import qiankun from 'vite-plugin-qiankun'
import VueDevTools from 'vite-plugin-vue-devtools'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const { name: title, version: APP_VERSION } = pkg as { name: string; version: string }

// node_modules 分包映射：包名 → chunk 名
// 易变（内部业务包，独立 chunk 便于增量发布）+ 不变（大依赖单独抽）
const CHUNK_MAP: Record<string, string> = {
    '@yzcfront/flexable': 'yzc-flexable',
    '@yzcfront/request': 'yzc-request',
    '@yzcfront/runtime-origin': 'yzc-runtime',
    'element-plus': 'element-plus',
    'lodash-es': 'lodash',
    dayjs: 'dayjs'
}

export default defineConfig(({ command }) => {
    const isDev = command === 'serve'

    const metaEnv = {
        APP_VERSION,
        APP_NAME: title,
        APP_BUILD_TIME: new Date().toISOString()
    }

    return {
        base: `/${title}/`,
        // 生产构建：移除 debugger、剥离非告警类 console（保留 warn/error）
        esbuild: isDev
            ? {}
            : {
                  pure: ['console.log', 'console.info', 'console.debug', 'console.trace'],
                  drop: ['debugger']
              },
        plugins: [
            // 约定式路由：src/pages 文件即路由
            VueRouter({
                routesFolder: 'src/pages',
                dts: './typed-router.d.ts'
            }),
            vue(),
            vueJsx(),
            // vue-tsc + eslint 并行检查，不阻塞 HMR（替代 deprecated 的 vite-plugin-eslint）
            checker({
                vueTsc: true,
                eslint: {
                    lintCommand: 'eslint .',
                    useFlatConfig: true
                }
            }),
            AutoImport({
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
                include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
                imports: [
                    'vue',
                    // unplugin-auto-import 内置 vue-router 预设
                    'vue-router',
                    'pinia',
                    {
                        from: 'vue',
                        imports: ['Reactive'],
                        type: true
                    }
                ],
                dts: './auto-imports.d.ts',
                injectAtEnd: true,
                eslintrc: {
                    enabled: true,
                    filepath: './.eslintrc-auto-import.json',
                    globalsPropValue: true
                }
            }),
            Components({
                resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
            }),
            VitePluginMetaEnv(metaEnv, 'import.meta.env'),
            VitePluginMetaEnv(metaEnv, 'process.env'),
            qiankun(title, { useDevMode: true }),
            // VueDevTools 仅在 dev 启用，避免增大生产包
            ...(isDev ? [VueDevTools()] : []),
            visualizer({ emitFile: true, filename: 'analysis.html' })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/style/element-namespace.scss" as *;`
                }
            },
            devSourcemap: true
        },
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                    manualChunks(id, { getModuleInfo }) {
                        if (id.includes('node_modules')) {
                            for (const [pkgName, chunk] of Object.entries(CHUNK_MAP)) {
                                if (id.includes(`/node_modules/${pkgName}/`)) return chunk
                            }
                            return 'vendor'
                        }
                        if (id.includes('/src/components/')) {
                            const importers = getModuleInfo(id)?.importers.length || 0
                            if (importers > 1) return 'common'
                        }
                    }
                }
            }
        },
        server: {
            headers: { 'Access-Control-Allow-Origin': '*' },
            cors: true,
            open: false,
            port: 6096,
            host: true,
            proxy: {
                '/gateway': {
                    target: 'https://portal.ukzhicai.com',
                    changeOrigin: true
                }
            },
            // 预热全部页面/组件 .vue，规避 components.d.ts 按需 transform 缩水
            warmup: {
                clientFiles: ['./src/pages/**/*.vue', './src/components/**/*.vue']
            }
        }
    }
})
