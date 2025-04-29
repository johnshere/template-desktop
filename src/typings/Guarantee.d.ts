interface IGuaranteeSumitForm {
    guarInfoId: string // 保函申请id
    legalName: string // 法人姓名
    legalCertNo: string // 法人身份证号码
    guaranteeAmount: number // 保函申请金额
    operatorName: string // 经办人姓名
    operatorCertNo: string // 经办人身份证号码
    operatorPhone: string // 经办人手机号
    busiLicenseAttRelaId: string // 营业执照附件关联id
    idcardFrontAttRelaId: string // 身份证正面附件关联id
    idcardBackAttRelaId: string // 身份证反面附件关联id
}
/**
 * 申请状态（0暂存 1提交）
 * @see ApplyStatusEnum
 */
type ApplyStatus = 0 | 1
interface IGuaranteeSumitDto extends PartialProps<IGuaranteeSumitForm, 'guarInfoId' | 'guaranteeAmount'> {
    applyStatus: ApplyStatus
    bidderName: string
    creditCode: string
    bidderCountry: string
    tenderee: string
}
/**
 * 退保状态[1退保成功 0未退 -1退保失败 2已发起退保 同枚举]
 * @see CloseStatusEnum
 */
type CloseStatus = 1 | 0 | -1 | 2
/**
 * 开函状态（0-未提交申请，1-审核中，2-通过，3-未通过，4-取消，6-已解保，7-已拒绝）
 * @see OpenStatusEnum
 */
type OpenStatus = 0 | 1 | 2 | 3 | 4 | 6 | 7
/**
 * 项目异常状态[1已终止,0或null正常]
 * @see AbortiveStatusEnum
 */
type AbortiveStatus = 0 | 1
interface IGuaranteeInfo extends IGuaranteeSumitForm {
    yzcBusiType: number
    projectId: string
    projectNo: string
    companyId: string
    bidderName: string
    projectName: string
    signupEndTime: string
    bidderId: string
    bidderName: string
    hanhuaBusiType: string
    financialId: number
    creditCode: string
    lgNo: string
    tenderee: string
    applyStatus: ApplyStatus
    applyUserId: string
    applyUserName: string
    applyTime: string
    payAmount: number
    payAccountName: string
    payAccountNo: string
    payStatus: string
    payTime: string
    payUpdateTime: string
    openStatus: OpenStatus
    auditOpinion: string
    guaranteeFileUrl: string
    guaranteeNumber: string
    guaranteeCode: string
    openTime: string
    openUpdateTime: string
    letterExpireStartTime: string
    letterExpireEndTime: string
    rate: number
    ensureType: string
    financeOrgName: string
    financialOrgName: string
    decStatus: number
    decTime: string
    winStatus: number
    releaseStatus: number
    releaseTime: string
    closeReason: number
    closeStatus: CloseStatus
    closeResult: string
    closeTime: string
    compensateStatus: number
    compensateMoney: number
    compensateContactName: string
    compensateContactPhone: string
    compensateReason: string
    compensateAccNo: string
    compensateUserId: string
    compensateUserName: string
    compensateAttRelaId: string
    compensateTime: string
    createTime: string
    createUserId: string
    createUserName: string
    updateTime: string
    delStatus: number
    projectDeposit: number
    orderNo: string
    payFrom: string
    closeDesc: string
    bidderCountry: string
    chargesType: number
    abortiveStatus: AbortiveStatus
    payeeName: string
}

/**
 * 投标人端 电子保函查询状态 1,"审核中";2,"已出函",3,"未通过",4,"已退保"
 * @see GuarStatusEnum
 */
type GuarStatus = 1 | 2 | 3 | 4 | 5
interface IGuaranteeListParams {
    projectNoLike: string
    guaranteeNumberLike: string
    guaranteeCodeLike: string
    guarStatusBidder?: GuarStatus
    current: number
    size: number
}
