import { useState } from 'react'
import { Button, Image, Input, View } from '@tarojs/components'
import type { ButtonProps, InputProps } from '@tarojs/components'
import Taro from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import { loginByCode } from '@/services/user'

import './index.scss'

const DEFAULT_AVATAR =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

export default function Login() {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR)
  const [nickName, setNickName] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const onChooseAvatar: ButtonProps['onChooseAvatar'] = (e) => {
    setAvatarUrl(e.detail.avatarUrl)
  }

  const onNickInput: InputProps['onInput'] = (e) => {
    setNickName(e.detail.value)
    return e.detail.value
  }

  const onGetPhoneNumber: ButtonProps['onGetPhoneNumber'] = async (e) => {
    const phoneCode = e.detail.code
    if (!phoneCode) {
      Taro.showToast({ title: '已取消授权', icon: 'none' })
      return
    }
    if (!nickName.trim()) {
      Taro.showToast({ title: '请填写昵称', icon: 'none' })
      return
    }
    if (avatarUrl === DEFAULT_AVATAR) {
      Taro.showToast({ title: '请选择头像', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      const { code } = await Taro.login()
      const resp = await loginByCode({
        code,
        phoneCode,
        avatarUrl,
        nickName: nickName.trim()
      })

      Taro.setStorageSync(STORAGE_KEYS.TOKEN, resp.token)
      Taro.setStorageSync(STORAGE_KEYS.USER_INFO, resp.userInfo)

      Taro.reLaunch({ url: '/pages/home/index' })
    } catch (err) {
      Taro.showToast({
        title: err instanceof Error ? err.message : '登录失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className='login'>
      <View className='login__title'>欢迎使用</View>
      <View className='login__subtitle'>登录后开启完整体验</View>

      <View className='login__avatar-wrap'>
        <Button
          className='login__avatar-btn'
          openType='chooseAvatar'
          onChooseAvatar={onChooseAvatar}
        >
          <Image className='login__avatar' src={avatarUrl} mode='aspectFill' />
        </Button>
        <View className='login__avatar-tip'>点击选择头像</View>
      </View>

      <View className='login__field'>
        <View className='login__label'>昵称</View>
        <Input
          className='login__input'
          type='nickname'
          placeholder='请输入昵称'
          value={nickName}
          onInput={onNickInput}
        />
      </View>

      <Button
        className='login__submit'
        openType='getPhoneNumber'
        loading={submitting}
        disabled={submitting}
        onGetPhoneNumber={onGetPhoneNumber}
      >
        微信一键登录
      </Button>

      <View className='login__hint'>登录即同意《用户协议》《隐私政策》</View>
    </View>
  )
}
