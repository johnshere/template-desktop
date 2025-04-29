import {
    ElMessage,
    ElMessageBox,
    type ElMessageBoxOptions,
    type ElMessageBoxShortcutMethod,
    type IElMessageBox,
    type MessageBoxData,
    type MessageBoxType
} from 'element-plus'
import type { AppContext } from 'vue'

export const alertError = (message: string) => {
    return ElMessage.error(message)
}

export const alertSuccess = (message: string) => {
    return ElMessage.success(message)
}

export const alertWarning = (message: string) => {
    return ElMessage.warning(message)
}

export const alertInfo = (message: string) => {
    return ElMessage.info(message)
}

const _msgBox = function (options: ElMessageBoxOptions, appContext?: AppContext | null): Promise<MessageBoxData> {
    return ElMessageBox(options, appContext)
}
const msgBoxFnFactory = (type: MessageBoxType, ops: ElMessageBoxOptions = {}) => {
    return function (...args) {
        const [message, title, options, appContext] = args
        let appCtx: AppContext | null = null
        let conf = {} as ElMessageBoxOptions
        if (typeof title === 'object') {
            conf = Object.assign({ message }, ops, title)
            appCtx = options as AppContext
        } else {
            conf = Object.assign({}, ops, { message, title, ...options })
            if (!conf.title) conf.title = '提示'
            appCtx = appContext as AppContext
        }
        Object.assign(conf, { type })
        return ElMessageBox(conf, appCtx)
    } as ElMessageBoxShortcutMethod
}
export const msgBoxAlert = (_msgBox.alert = msgBoxFnFactory('alert'))
export const msgBoxConfirm = (_msgBox.confirm = msgBoxFnFactory('confirm', { showCancelButton: true }))
export const msgBoxPrompt = (_msgBox.prompt = msgBoxFnFactory('prompt'))
export const msgBoxClose = (_msgBox.close = () => ElMessageBox.close())
_msgBox._context = null as any

export const msgBox = _msgBox as IElMessageBox
export const messageBox = _msgBox as IElMessageBox
