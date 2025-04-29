import { alertError, toLogin } from '@/libs'
import { useUserStore } from '@/stores'
import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import { Base } from '../consts/Request'

interface AbortInstance {
    // url: string
    // params: Record<string, any>
    // data: any
    config: AxiosRequestConfig
    controller: AbortController
}
export class AbortUtil {
    // 用于存储控制器对象
    static controllerMap = new Map<string, AbortInstance>()
    /**
     * 取消全部请求
     */
    static cancelAllRequest() {
        for (const [, { controller }] of this.controllerMap) {
            // 取消请求
            controller.abort()
        }
        this.controllerMap.clear()
    }
    /**
     * 取消指定的请求
     * @param url 待取消的请求URL
     */
    static cancelRequest(url: string | string[], baseURL = '') {
        const urlList = Array.isArray(url) ? url : [url]
        for (const _url of urlList) {
            for (const [key, { config, controller }] of this.controllerMap) {
                if (_url.startsWith('http') || !baseURL) {
                    if (config.url !== _url) continue
                } else {
                    if (baseURL + _url !== (config.baseURL || '') + config.url) continue
                }
                // 取消请求
                controller?.abort()
                this.controllerMap.delete(key)
            }
        }
    }
}

export class Request {
    // axios实例
    instance: AxiosInstance
    // 构造函数
    constructor(config?: CreateAxiosDefaults) {
        // 创建axios实例
        this.instance = axios.create(config)
        // 设置拦截器
        this.setInterceptors(this.instance)
    }
    // 请求
    request<R, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
        // console.log('config', config)
        return this.instance(config)
    }
    // 拦截器
    setInterceptors(request: AxiosInstance) {
        // 请求拦截器
        request.interceptors.request.use(config => {
            // toDo 也可以在这里做一个重复请求的拦截
            // https://github.com/axios/axios/tree/main#abortcontroller
            // 随机数作为请求key
            const requestKey = Math.random().toString(36).slice(2)
            ;(config as any).requestKey = requestKey
            // 实例化控制器
            const controller = new AbortController()
            // 将控制器实例与请求绑定
            config.signal = controller.signal
            // 将控制器实例存储到Map中
            AbortUtil.controllerMap.set(requestKey, { config, controller })
            // 设置请求头
            if (config && config.headers) {
                const auth = useUserStore().Authorization
                auth && config.headers.set('Authorization', auth)
            }
            return config
        })
        // 响应拦截器
        request.interceptors.response.use(
            (res: AxiosResponse<RequestResult, any>) => {
                const requestKey = (res.config as any).requestKey || 0
                // 请求完成后，将控制器实例从Map中移除
                AbortUtil.controllerMap.delete(requestKey)
                if (axios.isCancel(res)) {
                    console.log('Request canceled', res)
                    return Promise.reject(res)
                }
                if (res.request.responseType === 'blob') {
                    return Promise.resolve(res)
                }
                if (res.status === 200) {
                    // 未登录
                    if (res.data.code === 401) {
                        toLogin()
                        return Promise.reject(res)
                    }
                    if (res.config.responseType === 'blob') {
                        return Promise.resolve(res)
                    }
                    if (!res.data.success && res.config.showErrorMessage !== false) {
                        alertError(res.data?.message || res.data?.msg || `接口响应为失败状态`)
                    }
                    return Promise.resolve(res.data as any)
                } else {
                    if (res.config.showErrorMessage !== false) {
                        alertError(res.data?.message || res.data?.msg || `接口调用失败`)
                    }
                    console.error(res)
                    return Promise.reject(res)
                }
            },
            (error: AxiosError) => {
                console.log(error)
                if (error.config?.showErrorMessage !== false) {
                    if (!axios.isCancel(error)) {
                        alertError(`接口调用失败`)
                    }
                }
                throw error
            }
        )
    }
    // GET请求
    get<R, P = RequestResult<R>>(url: string, params?: Record<any, any>, options?: AxiosRequestConfig<any>) {
        return this.request<P>({ ...options, url, params, method: 'GET' })
    }
    // POST请求
    post<R, P = RequestResult<R>>(url: string, data?: any, options?: AxiosRequestConfig<any>) {
        return this.request<P>({ ...options, url, data, method: 'POST' })
    }
}

/**
 * 基础请求，扩展的话在下方新增
 */
export const request = new Request({ baseURL: Base.AiAssist })
export const gatewayRequest = new Request({ baseURL: Base.Gateway })
export const upmsRequest = new Request({ baseURL: Base.Upms })
export const evalRequest = new Request({ baseURL: Base.Eval })
export const supplierRequest = new Request({ baseURL: Base.Supplier })
export const depositRequest = new Request({ baseURL: Base.Deposit })
export const orderRequest = new Request({ baseURL: Base.Order })
