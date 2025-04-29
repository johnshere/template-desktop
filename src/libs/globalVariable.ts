const origin = location.origin
/** 新华印刷 */
export const isXhys = /\.xhys.com/.test(origin) || origin.includes('xhys.')
/** 淮北矿业 */
export const isHBKY = /\.junengsc.com/.test(origin) || origin.includes('junengsc.') || /\.hbcoal.com/.test(origin)
/** 北控 */
export const isBeiKong = /\.smartcitymall.cn/.test(origin) || origin.includes('zbcg.') || origin.includes('beikong.')
export const isDeploy = isXhys || isHBKY || isBeiKong
// export const isUsual = /\.(uk|u|you)zhicai.com/.test(origin) && !isBeiKong && !isXhys && !isHBKY;// 平台
/** 平台 */
export const isUsual = !isDeploy
