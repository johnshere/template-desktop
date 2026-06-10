import './assets/style/main.scss'
import '@/libs/flexable'

import { createApp, type App } from 'vue'
import { createPinia } from 'pinia'
import { renderWithQiankun, type QiankunProps } from 'vite-plugin-qiankun/dist/helper'

import appvue from './App.vue'
import { setupRouter } from './router'
import setupComponents from './setup-components'
import { isMicroApp, log } from '@/libs'

log()

let app: App<Element>

async function setupApp(props?: QiankunProps) {
    app = createApp(appvue)
    app.use(createPinia())
    app.use(setupComponents)
    await setupRouter(app, !!props)
    const container = props?.container?.querySelector('#bidagent-app')
    app.mount(container || '#bidagent-app')
}

if (!isMicroApp()) {
    setupApp()
} else {
    renderWithQiankun({
        mount(props) {
            console.log('[bidagent] qiankun mount', props)
            setupApp(props)
        },
        bootstrap() {
            console.log('[bidagent] qiankun bootstrap')
        },
        update() {
            console.log('[bidagent] qiankun update')
        },
        unmount() {
            console.log('[bidagent] qiankun unmount')
            app?.unmount()
        }
    })
}
