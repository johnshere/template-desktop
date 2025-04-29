interface PageReq {
    // 页码
    current: number
    // 每页显示条数
    size: number
}
interface PageRes<T> {
    // 当前页
    current: number
    // 每页显示条数
    size: number
    // 总条数
    total: number
    // 总页数
    pages: number
    records: T[]
}
