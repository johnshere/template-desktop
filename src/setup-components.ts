import type { App } from 'vue'
import UIBase from '@yzcfront/ui-base'

// 全局组件 / 指令 / Provide 注册位
export default {
    install(app: App) {
        app.use(UIBase)
    }
}
