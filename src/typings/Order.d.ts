interface ProjectOrder {
    projectOrderId: string
    orderId: string
    orderNo: string
    projectId: string
    projectCode: string
    projectName: string
    projectType: number
    bidderId: string
    bidderName: string
    tenderId: string
    tenderName: string
    chargeObject: number
    expireDate: string
    referee: string
    createTime: string
    updateTime: string
    subAcc: string
    sectionNames: string
    ownerCompanyId: string
    ownerCompanyName: string
    winTime: string
    depositAmount: number
    winMoney: number
    projectManagerName: string
    tenderType: string
    isWholeProcess: boolean
    isEnterArea: boolean
    tenderFeeConfigType: number
    openTime: string
    purchaseDeptId: string
    purchaseDeptName: string
    guaranteeMoneyLimit: number
    projectTypeVal: string
}

/**
 * 支付状态
 * @see {@link PayStatusEnum}
 * 说明:
 * 1 - 支付完成
 * 2 - 待支付
 * 3 - 支付失败
 * 4 - 订单关闭
 * 5 - 待审核
 * 6 - 审核不通过
 */
type PayStatus = 1 | 2 | 3 | 4 | 5 | 6

/**
 * 订单接口
 */
interface Order {
    /** 主键id */
    orderId: number
    /** 订单编号 */
    orderNo: string
    /**
     * 订单类型
     *
     * 枚举:
     * - BUSINESS_ORDER: 增值服务类订单
     * - PROJECT_ORDER: 项目类订单
     *
     * @example "BUSINESS_ORDER"
     */
    orderType: 'BUSINESS_ORDER' | 'PROJECT_ORDER'
    /** 服务类型 */
    orderServiceType: number
    /** 订单金额 */
    orderMoney: number
    /** 订单描述 */
    orderDesc: string
    /** 企业id */
    companyId: string
    /** 企业名称 */
    companyName: string
    /** 操作人id */
    creatorId: string
    /** 操作人名称 */
    creatorName: string
    /**
     * 支付状态
     *
     * 数值说明:
     * 1 - 支付完成
     * 2 - 待支付
     * 3 - 支付失败
     * 4 - 订单关闭
     * 5 - 待审核
     * 6 - 审核不通过
     *
     * 同时还关联以下枚举:
     * Over, Wait, Failure, Closed, WAIT_AUDIT, AUDIT_NOT_PASSED, VERIFICATION_NOT_PASSED, DEDUCTION_PENDING_APPLICATION
     *
     * @see {@link PayStatusEnum}
     */
    payStatus: PayStatus
    /** 支付时间 */
    payTime: string
    /** 支付提交时间 */
    paySubmitTime: string
    /** 创建时间 */
    createTime: string
    /** 操作时间 */
    updateTime: string
    /** 银行流水号 */
    bankSeqNo: string
    /** 银行回调时间 */
    bankBackTime: string
    /** 统一社会信用代码（支付人） */
    businessLicenseNo: string
    /**
     * 发票状态
     *
     * 枚举:
     * NONE, NOT_INVOICED, PENDING_REVIEW, REJECT, INVOICED,
     * PENDING_RE_INVOICING, PENDING_VERIFICATION, PENDING_RE_VERIFICATION,
     * BACKEND_INVOICING, OFFLINE_INVOICING
     */
    invoiceStatus: number
    /** 回调接口url */
    callbackUrl: string
    /** 回调参数json */
    businessData: string
    /** 来源类型 (1: yzc, 2: 山东yzc等) */
    sourceType: number
    /** 是否退款 */
    isBack: number
    /** 退款操作人Id */
    backUserId: string
    /** 退款操作人名称 */
    backUserName: string
    /** 退款操作时间 */
    backTime: string
    /** 退款原因 */
    backReason: string
    /** 退款关联订单编号 */
    backOrderNo: string
    /** 联系人（付款对象名称、系统内用户信息中的联系人名称） */
    contact: string
    /** 联系电话（系统内用户联系方式） */
    contactPhone: string
    /**
     * 付款时的会员等级
     *
     * 若为双会员，则展示两个会员等级
     */
    membershipLevel: string
    /** 支付人id */
    payUserId: string
    /** 支付人名称 */
    payUserName: string
    /** 支付内容 */
    payContent: string
    /**
     * 付款用户的类型
     *
     * 指“企业类型”，如投标人或供应商
     */
    companyType: string
    /** 支付金额（实际支付金额） */
    payMoney: number
    /** 优惠（折扣/减免）金额 */
    payDiscount: number
    /** 优惠类型 */
    payDiscountType: number
    /**
     * 支付平台
     *
     * 示例: 移动端、PC端，或后台创建时对公转账使用的支付平台
     */
    paymentPlatform: number
    /**
     * 支付方式
     *
     * 微信、支付宝、银联、对公转账等
     * @see {@link PaymentChannelEnum}
     */
    paymentChannel: number
    /** 收费项类型 */
    chargesType: number
    /** 实际支付订单编号 */
    payOrderNo: string
    /** 订单失效时间 */
    validTime: string
    /**
     * 具体服务内容
     *
     * 根据订单所属大类展示真实服务来源，并可能从配置中心读取
     */
    serviceContent: string
    /** 支付凭证附件关联id */
    payAttachmentId: string
    /** 附件审核原因/备注 */
    auditReason: string
    /** 推荐人 */
    referrer: string
    /** 收货地址 */
    shippingAddress: string
    /** 收货人 */
    consignee: string
    /** 收货人联系方式 */
    consigneePhone: string
    /** 区分技术服务费入款账户 */
    cusid: string
    /** 退款凭证附件关联id */
    backAttachmentId: string
    /** 划转时间 */
    transferTime: string
    /** 划转操作时间 */
    transferOperTime: string
    /** 划转操作人名称 */
    transferOperName: string
    /** 申请划转时间 */
    applyTransferTime: string
    /** 申请划转操作人 */
    applyTransferOperName: string
    /**
     * 是否划转
     *
     * 0：未划转, 1：已划转, 2：已申请/待划转
     */
    isTransfer: number
    /**
     * 入账状态
     *
     * 0：入账成功, 1：已退款, 2：已结算
     */
    indentStatus: number
    /** 开户行 */
    openBank: string
    /** 账户名称 */
    accountName: string
    /** 收款账号 */
    bankAccount: string
    /** 入账状态操作人ID */
    operId: string
    /** 入账状态操作人名称 */
    operName: string
    /** 入账状态操作时间 */
    operTime: string
    /** 项目关联信息 */
    projectOrder: ProjectOrder
    /** 业务关联信息 */
    businessOrder: any
    /** 发票关联信息 */
    invoiceOrder: any
    /** 绑定的权益 */
    uesdCouponList: any[]
    /** 支付状态展示文本 */
    payStatusVal: string
    /** 订单状态展示文本（用于列表展示，不适用于所有场景） */
    orderStatusVal: string
    /** 支付平台渠道展示文本 */
    paymentPlatformVal: string
    /** 支付方式展示文本 */
    paymentChannelVal: string
    /** 收费项类型展示文本 */
    chargesTypeVal: string
    /** 服务类型展示文本 */
    serviceTypeVal: string
    /** 会员等级展示文本 */
    membershipLevelVal: string
    /** 付款用户类型展示文本 */
    companyTypeVal: string
    /** 发票状态展示文本 */
    invoiceStatusVal: string
    /** 中国地区标识（1 表示中国） */
    isChina: number
    /** 是否可以使用保证金支付 */
    canDepositPay: boolean
    /** 应付金额 */
    shouldPayMoney: number
    /** 权益消耗情况 */
    couponUsed: boolean
    /** 优惠原因 */
    discountReason: string
}
