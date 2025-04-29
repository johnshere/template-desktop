/**
 * @Author: forguo
 * @Date: 2023/7/9 11:44
 * @Description: console控制栏调试
 */

// 环境变量
import { useUserStore } from '@/stores'
import { isClient } from './runtime-env'
import VConsole from 'vconsole'

const printEnv = () => {
    console.log(import.meta.env)
    // 由于process.env是单个定义的，所以也只能单个访问
    console.log(process.env.APP_VERSION)
    console.log(process.env.APP_NAME)
    console.log(process.env.APP_BUILD_TIME)

    // 判断是否为客户端环境
    console.log(isClient() ? 'isClient' : 'isBrowser')
    console.log('aspect-ratio：' + window.innerWidth / window.innerHeight)
}

const debugKey = '--debug'
const toLocalKey = '--local'
let hasVconsole = false
const debug = () => {
    let str = ''
    const opendebug = (e: KeyboardEvent) => {
        str += e.key
        if (str.length > 10) str = str.slice(str.length - 10)
        if (str.includes(debugKey) && !hasVconsole) {
            console.log('触发开启debug后门')
            new VConsole()
            hasVconsole = true
            setTimeout(printEnv, 4000)
            window.removeEventListener('keydown', opendebug)
        }
        if (str.includes(toLocalKey)) {
            const { pathname, hash } = location
            let url = `http://localhost:5000${pathname}${hash}`
            const auth = encodeURIComponent(useUserStore().Authorization)
            url += url.includes('?') ? `&Auth=${auth}` : `?Auth=${auth}`
            location.href = url
        }
    }
    window.addEventListener('keydown', opendebug)
}

export default () => {
    let flag = import.meta.env.PROD && isClient() && !location.href.includes('youzhicai.com')
    if (!flag) flag = import.meta.env.DEV && isClient()
    if (flag) {
        new VConsole()
        hasVconsole = true
    }
    debug()
    printEnv()
}
