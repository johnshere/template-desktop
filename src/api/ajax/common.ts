import { gatewayRequest } from './request'

export const getToken = () => {
    return gatewayRequest.get<string>('/getAccessToken')
}
