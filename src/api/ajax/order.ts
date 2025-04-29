import { Request, orderRequest } from './request'

/**
 * 获取订单详情
 * @retruns
 */
export const fetchOrderDetail = (orderNo: string) => {
    const url = '/pay/order/checkout'
    return orderRequest.get<any>(url, { orderNo })
}

/**
 * 校验本人订单
 */
export const checkOrder = (orderNo: string) => {
    const url = '/order/checkOrder'
    return orderRequest.get<boolean>(url, { orderNo })
}

/**
 * 支付
 * @retruns
 */
export const confirmPay = (data: PayDto) => {
    const url = '/order-api/hanhua/guarantee/confirmPayV2'
    return new Request().post<PayInfo>(url, data)
}
/**
 * 获取订单信息
 * @retruns
 */
export const findOrderByOrderNo = (orderNo: string) => {
    const url = '/order/findOrderByOrderNo'
    return orderRequest.get<Order>(url, { orderNo })
}
