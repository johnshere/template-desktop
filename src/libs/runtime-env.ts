/**
 * 运行环境相关处理
 */
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { getDomain, noop, urlToObj } from './utils'
import { useUserStore } from '@/stores'
import { isUsual } from './globalVariable'

/**
 * 是否为平台
 * @returns
 */
export function isPlatform() {
    return isUsual
}

// 判断是否为子应用
export function isMicroApp(): boolean {
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        return true
    }
    return false
}
const win = window as any
/**
 * 判断是否是运行在客户端中
 * @returns
 */
export function isClient(): boolean {
    return typeof win.bidOpenEvent !== 'undefined'
}
export function isBrowser(): boolean {
    return !isClient()
}

/**
 * 跳转登录，统一走此方法
 */
export const toLogin = () => {
    useUserStore().clearAuthorization()
    // 暂时处理，应跳转到自定义的登录页
    const win = top || window
    if (isUsual) {
        win.location.href = getDomain('passport')
    } else {
        win.location.href = '/user-management/account/login/pwd-login'
    }
}

// 客户端中，浏览器每次打开都会清空缓存，此处模拟缓存
type CacheType = 'localStorage' | 'sessionStorage'
type Cache = Record<string, string>
class ClientStorage {
    private storage?: Storage
    private getCache: () => Promise<Cache>
    private setCache: (data: Cache) => Promise<void>
    constructor(type: CacheType) {
        const setLocal: ((s: string) => Promise<void>) | undefined = win.bidOpenEvent?.setLocalCache
        const getLocal: (() => Promise<string>) | undefined = win.bidOpenEvent?.getLocalCache
        if (!setLocal || !getLocal) {
            this.storage = win[type]
        }
        this.getCache = async () => {
            const str = (await getLocal?.()) || '{}'
            const data = JSON.parse(str) as Record<CacheType, Cache>
            return data[type] || {}
        }
        this.setCache = async (data: Cache) => {
            const str = (await getLocal?.()) || '{}'
            const originData = JSON.parse(str) as Record<CacheType, Cache>
            originData[type] = data
            await setLocal?.(JSON.stringify(originData))
        }
    }
    async clear() {
        if (this.storage) {
            this.storage.clear()
        } else {
            await this.setCache({})
        }
    }
    async getItem(key: string) {
        if (this.storage) {
            return this.storage.getItem(key)
        } else {
            const data = await this.getCache()
            return data[key]
        }
    }
    async removeItem(key: string) {
        if (this.storage) {
            this.storage.removeItem(key)
        } else {
            const cache = await this.getCache()
            delete cache[key]
            await this.setCache(cache)
        }
    }
    async setItem(key: string, value: string) {
        if (this.storage) {
            this.storage.setItem(key, value)
        } else {
            value = value.toString()
            const cache = await this.getCache()
            cache[key] = value
            await this.setCache(cache)
        }
    }
}
// Object.defineProperty(win, 'localStorage', { value: new ClientStorage('localStorage'), writable: true })
// Object.defineProperty(win, 'sessionStorage', { value: new ClientStorage('sessionStorage'), writable: true })
export const localCache = new ClientStorage('localStorage')

const isMobile = ref(false)
window.addEventListener('resize', () => {
    console.log('window.innerWidth', window.innerWidth)
    isMobile.value = window.innerWidth <= 750
})
export const useIsMobile = () => {
    isMobile.value = window.innerWidth <= 750
    return isMobile
}
