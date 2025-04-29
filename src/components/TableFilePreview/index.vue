<template>
    <div class="table-file-preview">
        <UTitle :title="title">
            <template #side>
                <slot name="label"></slot>
            </template>
            <slot name="operate"></slot>
        </UTitle>
        <div ref="mainRef" class="main" @mousemove="move" @mouseup="end" @mouseleave="end">
            <slot name="btns"></slot>
            <div ref="tableRef" class="main-table" :class="hasBtnsSlot ? 'has-btns' : ''">
                <slot name="table" :tableHeight="tableHeight"></slot>
            </div>
            <div
                v-if="upperSrc || lowerSrc"
                ref="previewRef"
                class="main-preview"
                :class="hasBtnsSlot ? 'has-btns' : ''"
            >
                <div v-show="upperSrc || lowerSrc" class="expand-handle" @click="expand()">
                    <span>{{ expanded ? '收起' : '展开' }}</span>
                </div>
                <div class="grab-handle" @mousedown="start" />
                <div v-show="isDraging" class="preview-mask"></div>
                <FilePreviewFrame
                    v-show="showUpperFile"
                    v-if="upperSrc"
                    :src="upperSrc"
                    :jumpPage="upperJumpPage"
                    domId="previewFrame1"
                />
                <FilePreviewFrame
                    v-show="showLowerFile"
                    v-if="lowerSrc"
                    :src="lowerSrc"
                    :jumpPage="lowerJumpPage"
                    domId="previewFrame2"
                />
            </div>
            <div ref="toolRef" class="main-tool" />
        </div>
        <slot name="footer"></slot>
    </div>
</template>
<script lang="ts" setup>
import FilePreviewFrame from '@/components/FilePreviewFrame/index.vue'
import { noop } from '@/libs'
import { useSlots } from 'vue'
const slots = useSlots()
const hasBtnsSlot = !!slots.btns
const props = withDefaults(
    defineProps<{
        upperSrc?: string
        lowerSrc?: string
        title: string
        upperJumpPage?: number
        lowerJumpPage?: number
        showUpperFile?: boolean
        showLowerFile?: boolean
    }>(),
    {
        upperSrc: '',
        lowerSrc: '',
        showUpperFile: true,
        showLowerFile: true
    }
)
const mainRef = ref()
const tableRef = ref()
const previewRef = ref()
const toolRef = ref()
let A4Width = 0
onMounted(() => (A4Width = parseFloat(getComputedStyle(toolRef.value)?.width)))
const expanded = ref(false)

let width = parseFloat(localStorage.getItem('table-file-preview-width') || '') || 0
const setWidth = (w?: number) => {
    if (w) {
        let max = mainRef.value?.getBoundingClientRect().width as number
        if (!max) return
        const bound = Math.max(300, max * 0.3)
        w = Math.max(bound, Math.min(max - bound, w))
        // 留存
        localStorage.setItem('table-file-preview-width', (width = w) + '')
        tableRef.value.style.width = max - w + 'px'
        previewRef.value.style.marginRight = max - w + 'px'
        previewRef.value.style.paddingRight = '0.2rem'
        expanded.value = true
    } else {
        tableRef.value.style.width = '100%'
        previewRef.value.style.marginRight = '100%'
        previewRef.value.style.paddingRight = '0px'
        expanded.value = false
    }
}
const isDraging = ref(false)
let move: (e: MouseEvent) => void = noop
const end = () => (move = noop) && (isDraging.value = false)
const start = (e: MouseEvent) => {
    const startX = e.clientX
    const origin = previewRef.value.getBoundingClientRect().width
    isDraging.value = true
    move = (e: MouseEvent) => setWidth(origin - startX + e.clientX)
}
const expand = (toExpand?: boolean) => {
    const max = mainRef.value?.getBoundingClientRect().width
    if (!max) return
    if (toExpand === true) {
        setWidth(width || A4Width)
    } else if (toExpand === false) {
        setWidth()
    } else if (Math.abs(max - parseFloat(getComputedStyle(tableRef.value)?.width || '')) < 10) {
        setWidth(width || A4Width)
    } else {
        setWidth()
    }
}
watch(
    () => [!!previewRef.value, props.upperSrc, props.lowerSrc],
    values => values?.[0] && expand(!!(values?.[1] || values?.[2])),
    { immediate: true, deep: true }
)
const tableHeight = ref('')
onMounted(() => {
    nextTick(() => {
        tableHeight.value =
            tableRef.value && tableRef.value.getBoundingClientRect().height > 0
                ? tableRef.value.getBoundingClientRect().height - 52 + 'px'
                : ''
    })
})

defineExpose({ expand })
</script>
<style scoped lang="scss">
@import '@/assets/style/mixins';
.table-file-preview {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 18px 10px;
    overflow: hidden;
    * {
        box-sizing: border-box;
    }
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 74px;
        // padding-top: 6px;
        &-label {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0 12px;
            :deep(.label) {
                font-family: Microsoft YaHei;
                font-size: 14px;
                line-height: 14px;
                color: #333333;
                .eu-select {
                    width: 280px;
                    display: inline-block;
                }
            }
        }
    }
    .main {
        flex: 1;
        position: relative;
        // overflow: hidden;
        * {
            --eu-table-border-color: #dddfe6;
        }
        &-table {
            width: 100%;
            height: 100%;
            position: absolute;
            right: 0;
            border: 1px solid var(--eu-table-border-color);
            border-radius: 5px;
            overflow: auto;
            overflow-x: hidden;
            @include scrollBar;
            &.has-btns {
                height: calc(100% - 40px);
                top: 40px;
            }
            :deep(.eu-table) {
                position: absolute;
                top: -1px;
                right: -1px;
                bottom: -1px;
                left: -1px;
                width: unset;
                max-width: unset;
            }
        }
        &-preview {
            z-index: 99;
            margin-right: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px 0;
            padding-right: 20px;
            user-select: none;
            &.has-btns {
                height: calc(100% - 40px);
            }
            .expand-handle {
                z-index: 100;
                position: absolute;
                top: 50%;
                right: 0px;
                transform: translate(100%, -50%);
                width: 20px;
                height: 56px;
                opacity: 0.6;
                background-image: url(@/assets/images/expand-handle.png);
                background-size: 20px 56px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                span {
                    width: 13px;
                    font-family: Microsoft YaHei;
                    font-size: 12px;
                    line-height: 18px;
                    letter-spacing: 0px;
                    color: #ffffff;
                }
            }
            .grab-handle {
                width: 10px;
                cursor: col-resize;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
            }
            .preview-mask {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 10px;
                z-index: 2;
            }
            :deep(.file-preview) {
                width: 100%;
                flex: 1;
                border-radius: 5px;
                border: solid 1px var(--eu-table-border-color);
                overflow: hidden;
                z-index: 1;
            }
        }
        &-tool {
            width: 220mm;
            position: absolute;
            left: -300%;
        }
    }
    .tip {
        font-family: Microsoft YaHei;
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #666666;
        height: 44px;
        line-height: 44px;
    }
}
</style>
