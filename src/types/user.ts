export interface UserInfo {
  avatarUrl: string
  nickName: string
  phone?: string
}

export interface LoginResp {
  token: string
  userInfo: UserInfo
}
