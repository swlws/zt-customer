export interface BannerItem {
  id: number
  image: string
  title: string
  descriptionLines: string[]
}

export interface QuickEntryItem {
  id: number
  icon: string
  text: string
  color: string
}

export interface AnnouncementItem {
  id: number
  title: string
  tag: string
  date: string
}

export interface ProductItem {
  id: number
  image: string
  title: string
}

export interface HomeData {
  bannerList: BannerItem[]
  quickEntries: QuickEntryItem[]
  announcements: AnnouncementItem[]
  products: ProductItem[]
}
