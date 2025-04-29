interface FileUploadInfo {
    url: string
    attRelaId: string
}
interface FileUploadResult {
    id: string
}
interface Attachment {
    attFileName: string
    attPath: string
    attRelaId: string
    attTypeCode: string
    attViewName: string
    attViewNameDes: string
    baseAttachmentId: string
    bidSectionId: string
    bidSectionIds: string
    creatTime: string
    createDate: string
    creator: string
    creatorName: string
    decryptStatus: number
    downLoadUrl: string
    encryptKey: string
    fileDesc: string
    fileLength: number
    fileSourceType: string
    oldId: string
    orgId: string
    previewUrl: string
    tendFileAttRelaId: string
    tendProjectId: string
    type: number
    /** 上传状态 */
    status?: 'ready' | 'uploading' | 'success' | 'fail'
}
type FileInfo = Attachment
