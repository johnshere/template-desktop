/* eslint-disable */
import * as axios from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        showErrorMessage?: boolean
    }
}