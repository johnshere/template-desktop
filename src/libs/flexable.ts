import flexable from 'flexable'
import { isClient, useIsMobile } from './runtime-env'
const top = window.top || window

// 是否可以缩放，只有客户端可以缩放，浏览器端可能会导致父子页面大小不一
export const isScalable = isClient()

let scale = Number(localStorage.getItem('fontSize-scale') || 1)

// 固定以屏幕比例显示
const isFlexable = /isFlexable=(\d)/.exec(location.href)?.[1] !== '0'
if (isScalable) {
    flexable.setFontSize = () => {
        const base = flexable.base // 移动端使用375px作为基准
        const unit = base / 100

        let w = top.document.documentElement.clientWidth || base
        if (!isFlexable) w = top.screen.width
        const root = window.document.documentElement
        root.style.fontSize = (w / unit) * scale + 'px'
        console.log(`[flexable] font-size: ${root.style.fontSize}px; scale: ${scale}`)
    }
} else {
    if (!isFlexable) {
        flexable.setFontSize = () => {
            const root = window.document.documentElement
            root.style.fontSize = '100px'
        }
    } else if (useIsMobile().value) {
        // 移动端模式
        const base = 375
        const unit = base / 100
        flexable.setFontSize = () => {
            const root = window.document.documentElement
            root.style.fontSize = (top.screen.width / unit) * scale + 'px'
        }
    }
}

flexable.install()
export const getFontScale = () => scale
export const setFontScale = (s: number) => {
    localStorage.setItem('fontSize-scale', String(s))
    scale = s
    flexable.setFontSize()
}
