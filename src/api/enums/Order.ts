import { Enum, type EnumKeyType } from './Enum'

/**
 * 支付状态
 * 1,支付完成;2,待支付;3,支付失败;4,订单关闭;5,待审核;6,审核不通过
 * Over, Wait, Failure, Closed, WAIT_AUDIT, AUDIT_NOT_PASSED, VERIFICATION_NOT_PASSED, DEDUCTION_PENDING_APPLICATION
 */
export class PayStatusEnum extends Enum<PayStatus, keyof typeof PayStatusEnum> {
    static readonly Over = new PayStatusEnum('支付完成', 1)
    static readonly Wait = new PayStatusEnum('待支付', 2)
    static readonly Failure = new PayStatusEnum('支付失败', 3)
    static readonly Closed = new PayStatusEnum('订单关闭', 4)
    static readonly WaitAudit = new PayStatusEnum('待审核', 5)
    static readonly AuditNotPassed = new PayStatusEnum('审核不通过', 6)
}
