import type { App } from 'vue'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export async function setupRouter(app: App, inQiankun = false) {
    const base = `/${import.meta.env.APP_NAME}/`
    const router = createRouter({
        history: inQiankun ? createMemoryHistory(base) : createWebHistory(base),
        routes
    })
    app.use(router)
    await router.isReady()
    return router
}
