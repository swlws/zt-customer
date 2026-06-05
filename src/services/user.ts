import { request } from './request'

import type { LoginResp } from '@/types/user'

const BASE_URL = ''

interface LoginParams {
  code: string
  phoneCode: string
  avatarUrl: string
  nickName: string
}

export function loginByCode(params: LoginParams) {
  return request<LoginResp>({
    url: `${BASE_URL}/auth/wx-login`,
    method: 'POST',
    data: params
  })
}
