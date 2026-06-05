import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import Taro from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { UserInfo } from '@/types/user'

import './index.scss'

export default function Home() {
  const [nick, setNick] = useState<string>('')

  useDidShow(() => {
    const info = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO)
    setNick(info?.nickName ?? '')
  })

  return (
    <View className='home'>
      <View className='home__hello'>
        Hi{nick ? `, ${nick}` : ''} 👋
      </View>
      <Text className='home__tip'>这里是主页骨架，后续内容待补</Text>
    </View>
  )
}
