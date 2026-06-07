import type { HomeData } from '@/types/home'

const mockData: HomeData = {
  bannerList: [
    {
      id: 1,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20industrial%20equipment%20showcase%20banner%20with%20blue%20theme&image_size=landscape_16_9',
      title: '轮播图',
      descriptionLines: ['1、可以放企业宣传的事迹；', '2、新品的发布；', '3、重要活动等内容']
    },
    {
      id: 2,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=new%20product%20launch%20banner%20technology%20theme&image_size=landscape_16_9',
      title: '新品发布',
      descriptionLines: ['聚焦新品亮点与核心参数', '支持活动海报与会议通知', '提升首页内容更新频率']
    },
    {
      id: 3,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=important%20event%20promotion%20banner%20professional&image_size=landscape_16_9',
      title: '重要活动',
      descriptionLines: ['年度维保活动与会展预告', '售后政策与节假日通知', '客户服务能力统一展示']
    }
  ],
  quickEntries: [
    { id: 1, icon: '🔧', text: '报修', color: '#ff7d00' },
    { id: 2, icon: '📱', text: '设备', color: '#1677ff' },
    { id: 3, icon: '💬', text: '反馈', color: '#52c41a' },
    { id: 4, icon: '👩‍💼', text: '客服', color: '#722ed1' },
  ],
  announcements: [
    { id: 1, title: '【维保政策更新】2026年度设备延保服务开启', tag: '维保政策', date: '2025-06-01' },
    { id: 2, title: '【节假日通知】2026年五一放假，紧急故障请拨值班热线', tag: '服务通知', date: '2025-06-01' },
    { id: 3, title: '【活动预告】夏季设备养护活动即将开始', tag: '活动预告', date: '2025-05-25' }
  ],
  products: [
    { id: 1, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20optical%20measuring%20instrument%20on%20light%20gray%20background&image_size=square', title: '高端进口影像测量仪' },
    { id: 2, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=manual%20optical%20measuring%20instrument%20device&image_size=square', title: '手动影像测量仪/二次元' },
    { id: 3, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20optical%20measuring%20instrument%20on%20light%20gray%20background&image_size=square', title: '高端进口影像测量仪' },
    { id: 4, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=manual%20optical%20measuring%20instrument%20device&image_size=square', title: '手动影像测量仪/二次元' }
  ]
}

export function mockGetHomeData(): Promise<HomeData> {
  console.info('[HomeServiceMock] Returning mock home data.')
  return Promise.resolve(mockData)
}
