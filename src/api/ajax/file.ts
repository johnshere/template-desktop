import { getDomain, getUuid } from '@/libs'
import { Request, supplierRequest as request } from './request'
import { isDeploy } from '@/libs/globalVariable'
import type { UploadFile } from 'element-plus'

export class FileApi {
    /**
     * 上传附件，文件系统的传统前后不分离功能，转为axios提交
     * 平台
     * @param {*} file
     * @param {*} relaId
     * @param {*} folder 必须是uuid
     * @param {*} params
     * @returns
     */
    static async upload(
        file: UploadFile & { id?: string },
        relaId: string,
        folder: string,
        params: Record<string, any>,
        showErrorMessage = true
    ) {
        if (isDeploy) return await FileApi.uploadDeploy(file, relaId, folder, params, showErrorMessage)

        let url = `/file-app/fileupload/multiupload.aspx?`
        url += 'RFolder=' + folder
        url += '&RelaId=' + relaId
        Object.keys(params).forEach(k => (url += '&' + k + '=' + params[k]))

        const data = new FormData()
        data.append('qqfilename', file.name)
        data.append('qqtotalfilesize', file.size as any)
        data.append('qqfile', file.raw as any)
        data.append('qquuid', file.id || getUuid())

        return await new Request().post<FileUploadResult>(url, data, { showErrorMessage })
    }
    /**
     * 上传附件，文件系统的传统前后不分离功能，转为axios提交
     * 部署
     * @param {*} file
     * @param {*} relaId
     * @param {*} folder
     * @param {*} params
     * @returns
     */
    static async uploadDeploy(
        file: UploadFile,
        relaId: string,
        folder: string,
        params: Record<string, any>,
        showErrorMessage = true
    ) {
        let url = `/yzc-bigfile/fileupload/multiupload?rFolder=${folder}&relaId=${relaId}`
        url += '&type=81AD2E0019F0D097'
        Object.keys(params).forEach(k => (url += '&' + k + '=' + params[k]))

        const data = new FormData()
        data.append('qqfile', file.raw as any)

        const res = await new Request().post<string>(url, data, { showErrorMessage })
        if (res?.success) {
            return { ...res, data: { id: res?.data || '' } } as SuccessResult<FileUploadResult>
        }
        return res
    }
    /**
     * 获取上传文件地址，上传信息
     * @param attRelaId
     * @param projectId
     * @returns
     */
    static getUploadFileUrl(attRelaId: string, projectId: string) {
        const url = `/files/toupload?attRelaId=${attRelaId}&projectId=${projectId}&fileCode=2`
        return request.get<FileUploadInfo>(url)
    }
    /**
     * 获取文件列表
     * @param attRelaId
     * @returns
     */
    static getUploadList(attRelaId: string) {
        return request.post<Attachment[]>('/files/getFiles', { attRelaId })
    }
    /**
     * 文件预览
     * @param attRelaId
     * @param baseAttachmentId
     * @returns
     */
    static preview(attRelaId: string, baseAttachmentId: string) {
        const url = `/files/preview?baseAttachmentId=${baseAttachmentId}&attRelaId=${attRelaId}`
        return request.get<string>(url)
    }
    /**
     * 文件删除
     * @param baseAttachmentId
     * @returns
     */
    static delAttach(baseAttachmentId: string) {
        return request.post<null>('/files/delAttach', { baseAttachmentId })
    }
    // 文件下载
    // downFileUrl = CONTEXT_PATH + '/files/downFileUrl'
}
export class PreviewApi {
    /**
     * 文件预览
     * @param url
     * @returns
     */
    static preview(url: string, open = true) {
        const domain = getDomain('file1')
        url = `${domain}/filepreview/file/preview?url=${encodeURIComponent(url)}`
        if (open) {
            window.open(url)
        } else {
            return url
        }
    }
}
