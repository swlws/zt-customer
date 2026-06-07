import { useState } from 'react'
import { Image, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import { getUserStats } from '@/services/mine'
import type { UserInfo } from '@/types/user'
import type { UserStats } from '@/types/mine'

import './index.scss'

export default function Mine() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [stats, setStats] = useState<UserStats>({
    deviceCount: 0,
    monthlyRepairCount: 0,
    totalRepairCount: 0
  })

  useDidShow(() => {
    const info = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO)
    setUser(info || null)

    getUserStats().then(setStats).catch(() => {})
  })

  const primaryMenuItems = [
    { key: 'feedback', text: '意见反馈' },
    { key: 'about', text: '关于我们' },
    { key: 'privacy', text: '隐私政策' },
    { key: 'agreement', text: '用户协议' }
  ] as const

  const secondaryMenuItems = [{ key: 'settings', text: '设置' }] as const

  const openAgreementPage = (type: 'privacy' | 'user') => {
    Taro.navigateTo({
      url: `/pages/agreement/index?type=${type}`
    })
  }

  const onClickMenu = (
    key: (typeof primaryMenuItems)[number]['key'] | (typeof secondaryMenuItems)[number]['key']
  ) => {
    if (key === 'agreement') {
      openAgreementPage('user')
      return
    }

    if (key === 'privacy') {
      openAgreementPage('privacy')
      return
    }

    Taro.showToast({ title: '敬请期待', icon: 'none' })
  }

  const renderAvatar = () => {
    if (user?.avatarUrl) {
      return (
        <Image
          className='mine__avatar-image'
          src={user.avatarUrl}
          mode='aspectFill'
        />
      )
    }

    return (
      <View className='mine__avatar-placeholder'>
        <Text className='mine__avatar-placeholder-text'>头像</Text>
      </View>
    )
  }

  return (
    <View className='mine'>
      <View className='mine__hero'>
        <View className='mine__profile'>
          <View className='mine__avatar'>{renderAvatar()}</View>
          <View className='mine__profile-meta'>
            <View className='mine__nickname'>{user?.nickName || '用户昵称'}</View>
          </View>
        </View>
      </View>

      <View className='mine__content'>
        <View className='mine__stats-card'>
          <View className='mine__stat'>
            <View className='mine__stat-value'>{stats.deviceCount}</View>
            <Text className='mine__stat-label'>设备数量</Text>
          </View>
          <View className='mine__stat'>
            <View className='mine__stat-value'>{stats.monthlyRepairCount}</View>
            <Text className='mine__stat-label'>本月报修</Text>
          </View>
          <View className='mine__stat'>
            <View className='mine__stat-value'>{stats.totalRepairCount}</View>
            <Text className='mine__stat-label'>累计报修</Text>
          </View>
        </View>

        <View className='mine__menu-group'>
          {primaryMenuItems.map((item) => (
            <View
              key={item.key}
              className='mine__menu-card'
              onClick={() => onClickMenu(item.key)}
            >
              <Text className='mine__menu-text'>{item.text}</Text>
            </View>
          ))}
        </View>

        <View className='mine__menu-group mine__menu-group--secondary'>
          {secondaryMenuItems.map((item) => (
            <View
              key={item.key}
              className='mine__menu-card'
              onClick={() => onClickMenu(item.key)}
            >
              <Text className='mine__menu-text'>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
