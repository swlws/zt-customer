export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/login/index",
    "pages/home/index",
    "pages/mine/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#1677ff",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        text: "主页",
        iconPath: "assets/logo.png",
        selectedIconPath: "assets/logo.png",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "assets/logo.png",
        selectedIconPath: "assets/logo.png",
      },
    ],
  },
});
