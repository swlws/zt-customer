import Taro from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'

interface Options<B = unknown> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: B
  header?: Record<string, string>
}

interface ApiResp<T> {
  code: number
  data: T
  msg: string
}

export async function request<T>(opts: Options): Promise<T> {
  const token = Taro.getStorageSync<string>(STORAGE_KEYS.TOKEN)
  const res = await Taro.request<ApiResp<T>>({
    timeout: 10_000,
    ...opts,
    header: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.header
    }
  })

  if (res.statusCode === 401) {
    Taro.removeStorageSync(STORAGE_KEYS.TOKEN)
    Taro.removeStorageSync(STORAGE_KEYS.USER_INFO)
    Taro.reLaunch({ url: '/pages/login/index' })
    throw new Error('未登录')
  }

  if (res.statusCode !== 200) {
    throw new Error(`HTTP ${res.statusCode}`)
  }

  if (res.data.code !== 0) {
    throw new Error(res.data.msg || '请求失败')
  }

  return res.data.data
}
