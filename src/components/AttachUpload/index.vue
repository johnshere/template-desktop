<script lang="tsx">
import { FileApi } from '@/api/ajax/file'
import { alertSuccess, alertWarning, msgBoxConfirm } from '@/libs'
import { fileCanPreview, getUuid, isUUID } from '@/libs/utils'
import { Document, Loading } from '@element-plus/icons-vue'
import type { uploadBaseProps, UploadFile } from 'element-plus'

interface Props extends Partial<typeof uploadBaseProps> {
    modelValue: string
    folder?: string
    maxSize?: number | string
    showGenerateTip?: Boolean
    /** 不展示文件列表 */
    isDel?: Boolean
    'onUpdate:modelValue'?: (id: string) => void
    onChange?: (fileList: Attachment[]) => void
    onRemove?: (file: Attachment) => void
}
export default defineComponent<Props>({
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        folder: {
            type: String,
            default: ''
        },
        multiple: {
            type: Boolean,
            default: true
        },
        accept: {
            type: String,
            default: '.7z,.rar,.zip,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.pdf,.png,.bmp,.txt,.mzc,.dwg'
        },
        maxSize: {
            type: [Number, String],
            default: 50
        },
        showGenerateTip: {
            type: Boolean,
            default: false
        },
        /** 不展示文件列表 */
        isDel: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit, slots }) {
        const id = ref('')
        const uploadUrl = ref('')
        const fileList = ref<Attachment[]>([])
        const isAdapter = ref(location.href.includes('isPrint=1') || location.href.includes('isPdf=1'))

        async function handleChange(file: UploadFile & { id?: string }) {
            const nameArr = file.name.split('.')
            const type = nameArr[nameArr.length - 1]
            const accept = (props.accept || '') as string
            if (!accept?.toLowerCase().includes(type.toLowerCase())) {
                alertWarning(`请上传${accept}格式文件`)
                return
            }
            if (fileList.value.length && !props.multiple) {
                alertWarning(`请删除旧文件`)
                return false
            }
            const maxSize = Number(props.maxSize!)
            // 校验大小
            if (file.size && file.size > maxSize * 1024 * 1024) {
                return alertWarning(`文件 ${file.name} 大小超过${maxSize}M`)
            }
            if (!props.folder || !isUUID(props.folder)) {
                return alertWarning(`参数folder: ${props.folder}； 不是UUID格式`)
            }

            let fileId = getUuid()
            file.id = fileId
            const item = { attViewName: file.name, baseAttachmentId: fileId, status: 'uploading' } as Attachment
            try {
                fileList.value.unshift(item)

                let strs = uploadUrl.value?.split('?')[1]?.split('&') || []
                // @ts-ignore
                const params: Record = strs.reduce((s, t) => (t = t.split('=')) && (s[t[0]] = t[1]) && s, {})
                params.mus = maxSize * 1024 * 1024
                const result = await FileApi.upload(file, id.value, props.folder, params, false)
                if (result?.success) {
                    alertSuccess(file.name + ' 上传成功')
                    item.status = undefined
                    if (result.data?.id) {
                        fileId = result.data.id
                        item.baseAttachmentId = fileId
                    }
                    const res = await FileApi.getUploadList(id.value)
                    if (res.success) {
                        const f = res.data?.find(f => f.baseAttachmentId.toLowerCase() === fileId.toLowerCase())
                        if (!f) return
                        const index = fileList.value.findIndex(
                            f => f.baseAttachmentId.toLowerCase() === fileId.toLowerCase()
                        )
                        fileList.value.splice(index, 1, f)
                        emit('change', fileList.value)
                    }
                } else {
                    alertWarning(file.name + ' 上传失败')
                    fileList.value = fileList.value.filter(f => f !== item)
                }
            } catch (error) {
                console.log(error)
                alertWarning(file.name + ' 上传失败')
                fileList.value = fileList.value.filter(f => f !== item)
            }
        }

        let setInvalid: Function
        async function getFilesList(next?: string) {
            setInvalid?.()
            let invalid = false
            setInvalid = () => (invalid = true)
            const res = await FileApi.getUploadList(next || id.value)
            if (invalid) return
            if (!res.success) return
            fileList.value = res.data
            emit('change', fileList.value)
        }
        watch(
            () => props.modelValue,
            next => {
                if (id.value && !next) {
                    emit('update:modelValue', id.value)
                    return
                }
                if (next && next !== id.value) {
                    getFilesList(next)
                }
                id.value = next || ''
                if (!id.value) {
                    id.value = getUuid()
                    emit('update:modelValue', id.value)
                }
            },
            { immediate: true }
        )

        async function deleteAtttach(item: Attachment) {
            await msgBoxConfirm('确定删除吗?', '提示信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            const res = await FileApi.delAttach(item.baseAttachmentId)
            if (!res.success) return
            alertSuccess('删除成功!')
            getFilesList()
            if (props.isDel) {
                emit('remove', item)
            }
        }
        function downFile(item: Attachment) {
            item.downLoadUrl && window.open(item.downLoadUrl)
        }
        async function previewFile(item: Attachment) {
            const res = await FileApi.preview(id.value, item.baseAttachmentId)
            if (!res.success) return
            window.open(res.data)
        }

        function renderTip() {
            const accept = (props.accept || '') as string
            let tip
            if (slots.tip) {
                tip = slots.tip()
            } else {
                tip = (
                    <span>
                        可上传 {accept!.replace(/\./g, '').replace(/,/g, '|')} 类型文件，且不超过{props.maxSize}M
                    </span>
                )
            }
            return (
                <el-link type='info' class='attach-uploa)d__tip' underline={false}>
                    {tip}
                </el-link>
            )
        }
        function renderUpload() {
            if (!slots.default) return
            return (
                <el-upload
                    action=''
                    on-change={handleChange}
                    auto-upload={false}
                    show-file-list={false}
                    multiple={props.multiple}
                    accept={props.accept}
                    style='white-space: initial; font-size: 0'
                >
                    {{
                        trigger: () => <div class='attach-upload__trigger'>{slots.default?.()}</div>,
                        tip: renderTip
                    }}
                </el-upload>
            )
        }
        function renderOperate(item: Attachment) {
            if (isAdapter.value) return
            return (
                <>
                    {fileCanPreview(item.attViewName) ? (
                        <span class='upload-handle eu-link eu-link--primary' onClick={() => previewFile(item)}>
                            预览
                        </span>
                    ) : null}
                    <span class='upload-handle eu-link eu-link--primary' onClick={() => downFile(item)}>
                        下载
                    </span>
                    {slots.default ? (
                        <span class='upload-handle eu-link eu-link--danger' onClick={() => deleteAtttach(item)}>
                            删除
                        </span>
                    ) : null}
                </>
            )
        }
        function renderFile(item: Attachment) {
            return (
                <div key={item.baseAttachmentId} class={isAdapter.value ? '' : 'upload-wrapper'}>
                    <el-icon>{item.status ? <Loading /> : <Document />}</el-icon>
                    <span
                        class={isAdapter.value ? '' : 'upload-filename'}
                        title={item.attViewName}
                        style='margin-right: 18px'
                    >
                        {item.attViewName}
                    </span>
                    {renderOperate(item)}
                </div>
            )
        }
        function renderCreating() {
            if (!props.showGenerateTip) return
            return (
                <u-link type='primary' underline={false} style='cursor: default'>
                    <el-icon>
                        <Loading />
                    </el-icon>
                    文件生成中，请稍后刷新查看
                </u-link>
            )
        }

        return () => {
            if (id.value && !isUUID(id.value)) return <span>{id.value}</span>
            return (
                <div class='attach-upload'>
                    {renderUpload()}
                    {fileList.value.length > 0 ? <div>{fileList.value.map(renderFile)}</div> : null}
                    {renderCreating()}
                </div>
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: block;
    width: 100%;
    text-align: center;
}

.upload-box {
    width: 100%;
}

.upload-wrapper {
    display: flex;
    align-items: center;
    color: #333;
    line-height: 32px;
    font-size: 14px;
    i {
        margin-right: 4px;
    }
    .upload-handle {
        margin: 0 10px;
        cursor: pointer;
        flex: none;
    }
    .upload-filename {
        max-width: 400px;
        text-overflow: ellipsis;
        white-space: nowrap; /* 防止文字换行 */
        overflow: hidden;
    }
}

.attach-upload {
    .attach-upload__trigger {
        position: relative;
        margin-right: 12px;
        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .attach-upload__tip {
        white-space: normal;
        line-height: 18px;
        padding: 4px 0;
        vertical-align: baseline;
    }
}
</style>
