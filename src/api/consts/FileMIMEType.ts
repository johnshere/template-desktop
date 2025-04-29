export const FileMIMEType = {
    /** 文本文件 */
    txt: 'text/plain',
    /** HTML文件 */
    html: 'text/html',
    /** CSS文件 */
    css: 'text/css',
    /** JavaScript文件 */
    js: 'application/javascript',
    /** JSON文件 */
    json: 'application/json',
    /** XML文件 */
    xml: 'application/xml',
    /** 图片（PNG） */
    png: 'image/png',
    /** 图片（JPEG） */
    jpg: 'image/jpeg',
    /** 图片（GIF） */
    gif: 'image/gif',
    /** 图片（SVG） */
    svg: 'image/svg+xml',
    /** PDF文件 */
    pdf: 'application/pdf',
    /** Microsoft Word文档 doc */
    doc: 'application/msword',
    /** Microsoft Word文档 docx */
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    /** Microsoft Excel文档 */
    xls: 'application/vnd.ms-excel',
    /** Microsoft Excel文档 xlsx */
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    /** Microsoft PowerPoint文档 */
    ppt: 'application/vnd.ms-powerpoint',
    /** Microsoft PowerPoint文档 pptx */
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    /** CSV文件 */
    csv: 'text/csv',
    /** ZIP文件 */
    zip: 'application/zip',
    /** RAR文件 */
    rar: 'application/x-rar-compressed',
    /** TAR文件 */
    tar: 'application/x-tar',
    /** GZIP文件 */
    gz: 'application/gzip',
    /** TGZ文件 */
    tgz: 'application/x-tar',
    /** 7ZIP文件 */
    '7z': 'application/x-7z-compressed',
    /** MP3文件 */
    mp3: 'audio/mpeg',
    /** WAV文件 */
    wav: 'audio/wav',
    /** MP4文件 */
    mp4: 'video/mp4',
    /** WMV文件 */
    wmv: 'video/x-ms-wmv',
    /** AVI文件 */
    avi: 'video/x-msvideo',
    /** FLV文件*/
    flv: 'video/x-flv',
    /** MPG文件 */
    mpg: 'video/mpeg',
    /** MPEG文件 */
    mpeg: 'video/mpeg'
}
/** 根据文件扩展名获取MIME类型 */
export const getMIMEType = (fileName: string) => {
    if (!fileName?.includes('.')) throw new Error('文件名格式错误')
    const ext = fileName.split('.').pop()?.toLocaleLowerCase()
    return FileMIMEType[ext as keyof typeof FileMIMEType] || 'application/octet-stream'
}
