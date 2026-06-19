export default defineAppConfig({
  pages: [
    'pages/shelf/index',
    'pages/urge/index',
    'pages/notify/index',
    'pages/mine/index',
    'pages/search/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#7C3AED',
    navigationBarTitleText: '追更神器',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF9FF'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/shelf/index',
        text: '书架'
      },
      {
        pagePath: 'pages/urge/index',
        text: '催更墙'
      },
      {
        pagePath: 'pages/notify/index',
        text: '通知'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
