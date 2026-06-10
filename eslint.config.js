import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import eslintConfigPrettier from '@vue/eslint-config-prettier'
import fs from 'node:fs'

// 自动导入产物里的 globals，首次启动时文件可能尚未生成
let autoImportGlobals = {}
try {
    autoImportGlobals = JSON.parse(fs.readFileSync('./.eslintrc-auto-import.json', 'utf8')).globals || {}
} catch {
    // 忽略：vite 启动后会生成
}

configureVueProject({
    tsSyntaxInTemplates: true,
    scriptLangs: ['ts', 'tsx']
})

export default defineConfigWithVueTs([
    globalIgnores([
        '**/node_modules/**',
        '**/dist/**',
        '**/auto-imports.d.ts',
        '**/components.d.ts',
        '**/typed-router.d.ts',
        'scripts/**'
    ]),
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node, ...autoImportGlobals }
        }
    },
    js.configs.recommended,
    // 比 essential 严一档：覆盖大部分常见 Vue 写法约束
    pluginVue.configs['flat/strongly-recommended'],
    vueTsConfigs.recommended,
    skipFormatting,
    eslintConfigPrettier,
    {
        rules: {
            // debugger / console 由 esbuild 在 build 时剥离，开发期不限制
            'no-debugger': 'off',
            'no-console': 'off',
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^e'
                }
            ],
            '@typescript-eslint/no-empty-object-type': 'off',
            'vue/valid-attribute-name': 'off',
            // 团队规约：禁止直接 ElMessage / ElMessageBox / top
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'MemberExpression[object.name="ElMessage"]',
                    message: '请使用 @/libs 中封装的 alertXxx 系列函数'
                },
                {
                    selector: 'MemberExpression[object.name="ElMessageBox"]',
                    message: '请使用 @/libs 中封装的 msgBoxXxx 系列函数'
                }
            ],
            'no-restricted-globals': [
                'error',
                {
                    name: 'top',
                    message: '请使用 @/libs 中的 getTopWin() 方法替代直接使用 top'
                }
            ],
            'vue/no-restricted-syntax': [
                'error',
                {
                    selector: 'VAttribute[key.name="append-to-body"]',
                    message: 'Dialog 组件不允许使用 append-to-body 属性，请替换为 append-to="#bidagent-app"'
                }
            ]
        }
    }
])
