import { useState } from 'react'
import { Button, Image, Text, View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import Taro from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { UserInfo } from '@/types/user'

import placeholderAvatar from '@/assets/logo.png'

import './index.scss'

const PLACEHOLDER_AVATAR = placeholderAvatar

export default function Mine() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useDidShow(() => {
    const info = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO)
    setUser(info || null)
  })

  const onLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确认退出当前账号？',
      success: (res) => {
        if (!res.confirm) return
        Taro.removeStorageSync(STORAGE_KEYS.TOKEN)
        Taro.removeStorageSync(STORAGE_KEYS.USER_INFO)
        Taro.reLaunch({ url: '/pages/login/index' })
      }
    })
  }

  return (
    <View className='mine'>
      <View className='mine__card'>
        <Image
          className='mine__avatar'
          src={user?.avatarUrl || PLACEHOLDER_AVATAR}
          mode='aspectFill'
        />
        <View className='mine__meta'>
          <View className='mine__nick'>{user?.nickName || '未登录'}</View>
          <Text className='mine__phone'>{user?.phone || '未绑定手机号'}</Text>
        </View>
      </View>

      {user && (
        <Button className='mine__logout' onClick={onLogout}>
          退出登录
        </Button>
      )}
    </View>
  )
}
