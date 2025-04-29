import { Request, gatewayRequest } from './request'

/**
 * 登录
 * @params data
 * @retruns
 */
export const getUserInfo = () => {
    const url = '/admin/admin/getLoginUserInfo'
    return gatewayRequest.get<UserInfo>(url, {})
}

// 获取公司信息
export const getCompanyInfo = (companyId: string) => {
    const url = '/pay-api/web/pay/company/info'
    return new Request().get<any>(url, { companyId })
}

// 获取非大陆企业信息
export const getForeignCompanyInfo = (companyId: string) => {
    const url = '/pay-api/web/pay/company/info/invoiceBidSubInfo'
    return new Request().get<any>(url, { companyId })
}
