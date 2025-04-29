<template>
    <div class="file-preview" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.4)">
        <iframe ref="frame" :src="computedSrc" frameborder="0" scrolling="no" :id="domId || 'previewFrame'" />
        <div class="file-preview-mask">
            <div v-for="i in 25" :key="i"></div>
        </div>
        <slot />
    </div>
</template>
<script lang="ts" setup>
import { getDomain } from '@/libs'
import { useUserStore } from '@/stores'

interface EditableWordPage {
    // 必须是可直接下载的url，url传递前需要进行URLEncode编码
    // fileUrl: string
    // 页面类型：edit 编辑页面（合同模板嵌入的时候使用）；reviewComments 批注修订页面； finalRevision 最终确定页面
    // pageType: 'edit' | 'reviewComments' | 'finalRevision'
    // 文件唯一标识key
    fileId?: string
    // 当前打开文档的用户ID
    userId?: string
    // 当前打开文档的用户名
    userName?: string
    // 带文件格式后缀文件名，不传的时候默认是“当前时间戳.docx”
    fileName?: string
    // 权限校验token
    token?: string
    // 文件编码
    fileCode?: string
    sourceType?: string
}
interface EditablePage extends EditableWordPage {
    src: string
    editable: true
    onlyIframe: false
    jumpPage?: number
    domId?: string
}
interface PreviewPage {
    src: string
    editable?: false
    onlyIframe?: boolean
    jumpPage?: number
    domId?: string
}

const props = defineProps<PreviewPage | EditablePage>()

const { Authorization } = useUserStore()

const frame = ref()
const computedSrc = computed(() => {
    if (!props.src) return ''
    let url = props.src
    url += props.src.includes('?') ? `&` : `?`
    if (/gateway\//.test(props.src)) {
        url += `Authorization=${btoa(Authorization)}`
    }
    // if (Math.random() > 0) return url
    if (props.onlyIframe) return url
    if (props.editable) {
        const domain = getDomain('portal')
        url = `${domain}/fileconvert/file/openWordPage?fileUrl=${encodeURIComponent(url)}&pageType=edit`
        const keys = 'fileId,userId,userName,fileName,token,fileCode,sourceType'.split(',')
        // @ts-ignore
        keys.forEach(key => (url += `&${key}=${props[key]}`))
        return url
    } else {
        const domain = getDomain('file1')
        const newStr = /gateway\/evaltool/.test(props.src) ? '' : 'source=1&extName=pdf&'
        console.log('computedSrc', url)
        return `${domain}/filepreview/file/preview?${newStr}url=${encodeURIComponent(url)}`
    }
})
const loading = ref(false)
watch(
    () => props.src,
    () => {
        loading.value = true
        setTimeout(() => (loading.value = false), 1500)
    }
)
watch(
    () => props.jumpPage,
    () => {
        jumpPageHandle()
    }
)
const jumpPageHandle = () => {
    var iframe: any = document.getElementById(props.domId || 'previewFrame')
    var message = {
        command: 'gotoPage',
        pageIndex: props.jumpPage
    }
    if (!iframe) return
    const domain = getDomain('file1')
    console.log(domain, 'domain')
    console.log(message, 'message')
    console.log(message, iframe, iframe.contentWindow)
    iframe.contentWindow.postMessage(message, '*')
}
defineExpose({ jumpPageHandle })
</script>
<style lang="scss" scoped>
.file-preview {
    flex: 1;
    z-index: 1;
    position: relative;
    iframe {
        width: 100%;
        height: 100%;
        background: #e6e6e6;
    }
    &-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        display: flex;
        justify-content: space-around;
        div {
            height: 100%;
            width: 2px;
            pointer-events: auto;
        }
    }
}
</style>
