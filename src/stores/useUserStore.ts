import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getToken } from '@/api/ajax/common'
import { isHBKY } from '@/libs/globalVariable'
import { getUserInfo } from '@/api/ajax/baseInfo'
import configuration from 'dictionary-configuration'
import { Base } from '@/api/consts/Request'

if (isHBKY) {
    configuration.install({ tenantId: 'HBKYC', base: Base.Upms })
} else {
    configuration.install({ base: Base.Cportal })
}

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo>({
        userName: '',
        businessLicenseNo: '',
        companyName: '',
        userId: '',
        companyId: '',
        bidderName: '',
        evalUserType: null // 当前登录人进入系统身份
    })
    const Authorization = ref('')
    const isCanEditable = ref(true)
    const getAuthorization = async () => {
        const res = await getToken()
        if (!res?.success) return
        // 允许从缓存中获取，便于调试
        let token = res.data as string | null
        if (!token && import.meta.env.DEV) {
            token = decodeURIComponent(location.href.split('&Auth=').pop() || '')
        }
        if (token) {
            Authorization.value = token
        } else {
            console.log('获取的token数据为空')
        }
    }
    const clearAuthorization = () => (Authorization.value = '')
    const fetchUserInfo = async () => {
        const res = await getUserInfo()
        if (!res?.success) return
        userInfo.value = res.data
        isCanEditable.value = userInfo.value.evalUserType !== 6 // 用户类型为6（监督人时），只有查看功能，无编辑权限

        if (!isHBKY) {
            const tenantId = res.data.companyId
            configuration.install({ tenantId })
        }
    }
    return {
        userInfo,
        Authorization,
        isCanEditable,
        getAuthorization,
        fetchUserInfo,
        clearAuthorization
    }
})
