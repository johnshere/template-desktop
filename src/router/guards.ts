import { nprogress } from '@/libs'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores'
const whiteList = ['/login']
export const useGuards = (router: Router) => {
    //导航守卫
    router.beforeEach(async (to, from, next) => {
        console.log(
            to.path,
            whiteList.some(item => to.path.includes(item)),
            useUserStore().Authorization
        )
        if (!(useUserStore().Authorization || whiteList.some(item => to.path.includes(item)))) {
            try {
                await useUserStore().getAuthorization()
                await useUserStore().fetchUserInfo()
            } catch (error) {
                console.log(error)
            }
        }
        nprogress.start()
        next()
    })
    router.afterEach(to => {
        nprogress.done()
        document.title = (to.meta.title as string) || import.meta.env.VITE_SYSTEM_NAME
    })
    router.onError(error => {
        nprogress.done()
        console.error(error)
    })
}
