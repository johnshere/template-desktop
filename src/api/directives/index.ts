import { type App } from 'vue'
import vClickOutside from './vClickOutside'

export default {
    install(app: App) {
        app.use(vClickOutside)
    }
}
