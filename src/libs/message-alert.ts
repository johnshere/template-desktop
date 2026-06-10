import { ElMessage, ElMessageBox } from 'element-plus'
import type { MessageOptions } from 'element-plus'

type AlertLevel = 'success' | 'warning' | 'info' | 'error'

function alert(level: AlertLevel, message: string, opts?: Partial<MessageOptions>) {
    return ElMessage({ message, type: level, ...opts })
}

export const alertSuccess = (message: string, opts?: Partial<MessageOptions>) => alert('success', message, opts)
export const alertWarning = (message: string, opts?: Partial<MessageOptions>) => alert('warning', message, opts)
export const alertInfo = (message: string, opts?: Partial<MessageOptions>) => alert('info', message, opts)
export const alertError = (message: string, opts?: Partial<MessageOptions>) => alert('error', message, opts)

type MsgBoxOptions = Parameters<typeof ElMessageBox.confirm>[2]

export function msgBoxConfirm(message: string, title = '确认', opts?: MsgBoxOptions) {
    // eslint-disable-next-line no-restricted-syntax
    return ElMessageBox.confirm(message, title, { type: 'warning', ...opts })
}

export function msgBoxAlert(message: string, title = '提示', opts?: MsgBoxOptions) {
    // eslint-disable-next-line no-restricted-syntax
    return ElMessageBox.alert(message, title, opts)
}
