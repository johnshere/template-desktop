import { Enum, type EnumKeyType } from './Enum'
import AliPayLogo from '@/assets/images/ali-pay.png'
import WeChatPayLogo from '@/assets/images/wechat-pay.png'
/**
 * 1：支付宝，2：微信
 */
export class PayChannelEnum extends Enum<PayChannel, keyof typeof PayChannelEnum> {
    constructor(n: any, v: any, public logo: string) {
        super(n, v)
    }
    static readonly Alipay = new PayChannelEnum('支付宝', '1', AliPayLogo)
    static readonly Wechat = new PayChannelEnum('微信', '2', WeChatPayLogo)
}
/**
 * 1,移动端;2,PC端;3,-
 */
export class PayPlatformEnum extends Enum<PayPlatform, keyof typeof PayPlatformEnum> {
    static readonly Mobile = new PayPlatformEnum('移动端', 1)
    static readonly Desktop = new PayPlatformEnum('PC端', 2)
}
