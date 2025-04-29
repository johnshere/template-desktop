import './assets/style/main.scss'
import './libs/flexable'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupRouter } from './router'
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { log, isMicroApp } from '@/libs'
import directives from '@/api/directives'
import UIBase from 'ui-base'
import vant from 'vant'
import 'vant/lib/index.css'
// import 'vant/lib/icon/local.css'

log()

const app = createApp(App)

async function setupApp(rootContainer: Element | string) {
    app.use(UIBase)
    app.use(vant)
    app.use(createPinia())
    app.use(directives)
    // vue router
    await setupRouter(app)
    app.mount(rootContainer)
}

if (!isMicroApp()) {
    // 独立运行时
    setupApp('#deposit-app')
} else {
    renderWithQiankun({
        mount(props) {
            console.log('[vue] props from main framework', props)
            if (props.container) {
                setupApp(props.container.querySelector('#deposit-app') as Element)
            } else {
                setupApp('#deposit-app')
            }
        },
        bootstrap() {
            console.log('[vue] vue app bootstraped')
        },
        update() {
            console.log('[vue] vue app update')
        },
        unmount() {
            console.log('[vue] vue app unmount')
            app?.unmount()
        }
    })
}
