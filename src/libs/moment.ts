import mz from 'moment-timezone'

const zone = 'Asia/Beijing'

// 设置时区
mz.tz.setDefault(zone)

export const timezone = zone

export const moment = mz
