import { useMemo, useState } from 'react'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import { getHomeData } from '@/services/home'
import type { HomeData, ProductItem, QuickEntryItem } from '@/types/home'

import './index.scss'

const INITIAL_HOME_DATA: HomeData = {
  bannerList: [],
  quickEntries: [],
  announcements: [],
  products: []
}

const QUICK_ENTRY_ROUTE_MAP: Record<string, () => void> = {
  '报修': () => {
    Taro.setStorageSync(STORAGE_KEYS.REPAIR_ACTIVE_TAB, 'form')
    Taro.switchTab({ url: '/pages/repair/index' })
  },
  '设备': () => {
    Taro.switchTab({ url: '/pages/device/index' })
  },
  '反馈': () => {
    Taro.showToast({ title: '反馈功能建设中', icon: 'none' })
  },
  '客服': () => {
    Taro.showModal({
      title: '联系客服',
      content: '客服热线：400-800-1234',
      confirmText: '呼叫',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: '4008001234' })
        }
      }
    })
  }
}

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [homeData, setHomeData] = useState<HomeData>(INITIAL_HOME_DATA)

  useDidShow(() => {
    getHomeData().then(setHomeData).catch(() => {
      Taro.showToast({ title: '首页数据加载失败', icon: 'none' })
    })
  })

  const { bannerList, quickEntries, announcements, products } = homeData
  const currentBannerItem = useMemo(
    () => bannerList[currentBanner] ?? bannerList[0] ?? null,
    [bannerList, currentBanner]
  )

  const handleBannerChange = (e: any) => {
    setCurrentBanner(e.detail.current)
  }

  const handleQuickEntryClick = (item: QuickEntryItem) => {
    const action = QUICK_ENTRY_ROUTE_MAP[item.text]
    if (action) {
      action()
      return
    }

    Taro.showToast({ title: '敬请期待', icon: 'none' })
  }

  const handleProgressQuery = () => {
    Taro.setStorageSync(STORAGE_KEYS.REPAIR_ACTIVE_TAB, 'records')
    Taro.switchTab({ url: '/pages/repair/index' })
  }

  const handleAnnouncementClick = (title: string, date: string) => {
    Taro.showModal({
      title: '公告详情',
      content: `${title}\n发布时间：${date}`,
      showCancel: false
    })
  }

  const handleProductClick = (product: ProductItem) => {
    Taro.previewImage({
      current: product.image,
      urls: products.map((item) => item.image)
    })
  }

  return (
    <View className='home'>
      <View className='home__hero'>
        <Swiper
          className='home__hero-swiper'
          autoplay
          circular
          interval={3200}
          duration={450}
          onChange={handleBannerChange}
        >
          {bannerList.map((item) => (
            <SwiperItem key={item.id}>
              <View className='home__hero-slide'>
                <Image className='home__hero-image' src={item.image} mode='aspectFill' />
              </View>
            </SwiperItem>
          ))}
        </Swiper>

        {currentBannerItem && (
          <View className='home__hero-copy'>
            <Text className='home__hero-title'>{currentBannerItem.title}</Text>
            {currentBannerItem.descriptionLines.map((line) => (
              <Text key={line} className='home__hero-line'>{line}</Text>
            ))}
          </View>
        )}

        <View className='home__hero-dots'>
          {bannerList.map((item, index) => (
            <View
              key={item.id}
              className={`home__hero-dot ${index === currentBanner ? 'is-active' : ''}`}
            />
          ))}
        </View>
      </View>

      <View className='home__content'>
        <View className='home__panel'>
          <View className='home__panel-header'>
            <Text className='home__panel-title'>快速入口</Text>
            <Text className='home__panel-more' onClick={handleProgressQuery}>进度查询</Text>
          </View>

          <View className='home__quick-grid'>
            {quickEntries.map((item) => (
              <View
                key={item.id}
                className='home__quick-item'
                onClick={() => handleQuickEntryClick(item)}
              >
                <View className='home__quick-icon-wrap'>
                  <View className='home__quick-icon-placeholder'>
                    <Text className='home__quick-icon-symbol'>{item.icon}</Text>
                  </View>
                </View>
                <Text className='home__quick-label'>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='home__panel'>
          <View className='home__panel-header'>
            <Text className='home__panel-title'>服务公告</Text>
            <Text className='home__panel-more' onClick={() => Taro.showToast({ title: '更多公告建设中', icon: 'none' })}>查看更多</Text>
          </View>

          <View className='home__announcement-list'>
            {announcements.map((item, index) => (
              <View
                key={item.id}
                className={`home__announcement-item ${index < announcements.length - 1 ? 'has-divider' : ''}`}
                onClick={() => handleAnnouncementClick(item.title, item.date)}
              >
                <Text className='home__announcement-title' numberOfLines={1}>{item.title}</Text>
                <View className='home__announcement-meta'>
                  <Text className='home__announcement-tag'>{item.tag}</Text>
                  <Text className='home__announcement-date'>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='home__section'>
          <View className='home__section-header'>
            <Text className='home__section-title'>产品展示</Text>
            <Text className='home__section-more' onClick={() => Taro.showToast({ title: '更多产品建设中', icon: 'none' })}>查看更多</Text>
          </View>

          <View className='home__product-grid'>
            {products.map((item) => (
              <View
                key={item.id}
                className='home__product-card'
                onClick={() => handleProductClick(item)}
              >
                <View className='home__product-image-wrap'>
                  <Image className='home__product-image' src={item.image} mode='aspectFit' />
                </View>
                <Text className='home__product-title' numberOfLines={1}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
