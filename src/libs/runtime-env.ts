export function isMicroApp(): boolean {
    return !!(window as unknown as { __POWERED_BY_QIANKUN__?: boolean }).__POWERED_BY_QIANKUN__
}

export function getTopWin(): Window {
    try {
        return window.top || window
    } catch {
        return window
    }
}
