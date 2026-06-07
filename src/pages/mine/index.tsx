import { useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { UserInfo } from "@/types/user";

import placeholderAvatar from "@/assets/logo.png";

import "./index.scss";

const PLACEHOLDER_AVATAR = placeholderAvatar;

export default function Mine() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useDidShow(() => {
    const info = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO);
    setUser(info || null);
  });

  const menuItems = [
    { key: "feedback", text: "意见反馈" },
    { key: "about", text: "关于我们" },
    { key: "agreement", text: "用户协议" },
    { key: "privacy", text: "隐私政策" },
    { key: "settings", text: "设置" },
  ] as const;

  const openAgreementPage = (type: "privacy" | "user") => {
    Taro.navigateTo({
      url: `/pages/agreement/index?type=${type}`,
    });
  };

  const onClickMenu = (key: (typeof menuItems)[number]["key"]) => {
    if (key === "agreement") {
      openAgreementPage("user");
      return;
    }
    if (key === "privacy") {
      openAgreementPage("privacy");
      return;
    }
    Taro.showToast({ title: "敬请期待", icon: "none" });
  };

  return (
    <View className="mine">
      <View className="mine__banner">
        <View className="mine__banner-content">
          <Image
            className="mine__avatar"
            src={user?.avatarUrl || PLACEHOLDER_AVATAR}
            mode="aspectFill"
          />
          <View className="mine__banner-meta">
            <View className="mine__nickname">
              {user?.nickName || "用户昵称"}
            </View>
          </View>
        </View>
      </View>

      <View className="mine__stats">
        <View className="mine__stat">
          <View className="mine__stat-value">2</View>
          <Text className="mine__stat-label">设备数量</Text>
        </View>
        <View className="mine__stat">
          <View className="mine__stat-value">0</View>
          <Text className="mine__stat-label">本月报修</Text>
        </View>
        <View className="mine__stat">
          <View className="mine__stat-value">3</View>
          <Text className="mine__stat-label">累计报修</Text>
        </View>
      </View>

      <View className="mine__menu">
        {menuItems.map((item, index) => (
          <View
            key={item.key}
            className={`mine__menu-item ${index === menuItems.length - 1 ? "mine__menu-item--last" : ""}`}
            onClick={() => onClickMenu(item.key)}
          >
            <Text className="mine__menu-text">{item.text}</Text>
            <Text className="mine__menu-arrow">›</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
