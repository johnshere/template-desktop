import { depositRequest } from './request'

/**
 * 保函申请信息查询
 * @retruns
 */
export const getGuarInfo = (guarInfoId: string) => {
    const url = '/guarInfo/getGuarInfo'
    return depositRequest.get<IGuaranteeInfo>(url, { guarInfoId })
}

/**
 * 保函申请信息提交
 * @retruns
 */
export const saveGuarInfo = (data: IGuaranteeSumitDto) => {
    const url = '/guarInfo/saveGuarInfo'
    return depositRequest.post<{ orderNo: string } | null>(url, data)
}

/**
 * 我的保函列表
 */
export const pageList = (data: IGuaranteeListParams) => {
    const url = '/guarBidder/pageList'
    return depositRequest.post<PageRes<IGuaranteeInfo>>(url, data)
}

/**
 * 我的保函-退保
 */
export const closeGuar = (data: { guarInfoId: string; closeDesc: string }) => {
    const url = '/guarBidder/closeGuar'
    return depositRequest.post<boolean>(url, data)
}
/**
 * 根据担保金额计算支付金额
 */
export const getPayMoney = (amount: string | number) => {
    const url = '/guarInfo/getPayMoney'
    return depositRequest.get<number>(url, { amount })
}
