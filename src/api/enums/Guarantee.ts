import { Enum, type EnumKeyType } from './Enum'

/**
 * 申请状态（0暂存 1提交）
 */
export class ApplyStatusEnum extends Enum<ApplyStatus, keyof typeof ApplyStatusEnum> {
    static readonly Saved = new ApplyStatusEnum('已暂存', 0)
    static readonly Committed = new ApplyStatusEnum('已提交', 1)
}
/**
 * 投标人端 电子保函查询状态 1,"审核中";2,"已出函",3,"未通过",4,"已退保",5,"退保审核中"
 */
export class GuarStatusEnum extends Enum<GuarStatus, keyof typeof GuarStatusEnum> {
    static readonly Reviewing = new GuarStatusEnum('审核中', 1)
    static readonly Opened = new GuarStatusEnum('已出函', 2)
    static readonly NotPass = new GuarStatusEnum('未通过', 3)
    static readonly Refunded = new GuarStatusEnum('已退保', 4)
    static readonly RefundedReviewing = new GuarStatusEnum('退保审核中', 5)
}
/**
 * 开函状态（0-未提交申请，1-审核中，2-通过，3-未通过，4-取消，6-已解保，7-已拒绝）
 */
export class OpenStatusEnum extends Enum<OpenStatus, keyof typeof OpenStatusEnum> {
    static readonly Uncommitted = new OpenStatusEnum('未提交申请', 0)
    static readonly Auditing = new OpenStatusEnum('审核中', 1)
    static readonly Passed = new OpenStatusEnum('通过', 2)
    static readonly NotPass = new OpenStatusEnum('未通过', 3)
    static readonly Cancel = new OpenStatusEnum('取消', 4)
    static readonly Dissolved = new OpenStatusEnum('已解保', 6)
    static readonly Refused = new OpenStatusEnum('拒绝', 7)
}
/**
 * 退保状态 1退保成功 0未退 -1退保失败 2已发起退保
 */
export class CloseStatusEnum extends Enum<CloseStatus, keyof typeof CloseStatusEnum> {
    static readonly Closed = new CloseStatusEnum('退保成功', 1)
    static readonly NotClose = new CloseStatusEnum('未退', 0) // 后台表示空也是这个状态
    static readonly Failed = new CloseStatusEnum('退保失败', -1)
    static readonly Closing = new CloseStatusEnum('已发起退保', 2)
}
/**
 * 项目异常状态[1已终止,0或null正常]
 */
export class AbortiveStatusEnum extends Enum<AbortiveStatus, keyof typeof AbortiveStatusEnum> {
    static readonly Normal = new AbortiveStatusEnum('正常', 0) // 后台表示空也是这个状态
    static readonly Abortive = new AbortiveStatusEnum('异常', 1)
}
