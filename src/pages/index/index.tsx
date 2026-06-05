import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'

export default function Index() {
  useLoad(() => {
    const token = Taro.getStorageSync<string>(STORAGE_KEYS.TOKEN)
    if (token) {
      Taro.switchTab({ url: '/pages/home/index' })
    } else {
      Taro.reLaunch({ url: '/pages/login/index' })
    }
  })

  return <View />
}
