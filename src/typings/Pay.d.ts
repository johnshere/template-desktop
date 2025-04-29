interface BaseInvoiceForm {
    registeredAddress: string
    fixedTel: string
    bankName: string
    bankAccount: string
}

interface InvoiceForm extends BaseInvoiceForm {
    businessLicenseNo: string
    companyName: string
    isIssueInvoices: number
    typeOfTaxpayer: number // 纳税人类型 2：企业
    invoiceType: number // 发票类型 1：专票 2：普票
    attachmentId: string // 附件id
    registeredAddress: string // 企业地址
    fixedTel: string
    bankName: string
    bankAccount: string
}

/** 1：支付宝，2：微信 */
type PayChannel = '1' | '2'
/**  1,移动端;2,PC端;3,- */
type PayPlatform = 1 | 2
interface PayDto {
    orderNo: string
    paymentChannel: PayChannel // 支付方式
    paymentPlatform: PayPlatform // 支付平台
    invoiceQo: InvoiceForm // 发票信息
}

interface PayInfo {
    imageUrl: string // 支付二维码地址
}
