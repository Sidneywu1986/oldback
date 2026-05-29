const app = getApp()

Page({
  data: {
    masterInfo: null,
    orderStats: {
      total: 0,
      pending: 0,
      approved: 0
    }
  },

  onLoad: function () {
    this.loadMasterInfo()
    this.loadOrderStats()
  },

  onShow: function () {
    this.loadMasterInfo()
  },

  loadMasterInfo: function () {
    const token = app.globalData.token
    if (!token) {
      this.setData({ masterInfo: null })
      return
    }

    wx.request({
      url: `${app.globalData.baseUrl}/masters/me`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ masterInfo: res.data.data })
        } else {
          this.setData({ masterInfo: null })
          wx.removeStorageSync('token')
          app.globalData.token = ''
        }
      },
      fail: () => {
        this.setData({ masterInfo: null })
      }
    })
  },

  loadOrderStats: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders/stats`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ orderStats: res.data.data })
        }
      }
    })
  },

  goToOrders: function () {
    wx.switchTab({ url: '/pages/orders/orders' })
  },

  goToPoints: function () {
    wx.switchTab({ url: '/pages/points/points' })
  },

  goToWallet: function () {
    wx.showToast({ title: '钱包功能开发中', icon: 'none' })
  },

  goToTicket: function () {
    wx.showToast({ title: '工单功能开发中', icon: 'none' })
  },

  goToSettings: function () {
    wx.showToast({ title: '设置功能开发中', icon: 'none' })
  },

  goToAbout: function () {
    wx.showModal({
      title: '关于飞玖回收',
      content: '飞玖回收 - 专业的汽车配件回收平台\n版本：1.0.0',
      showCancel: false
    })
  },

  goToHelp: function () {
    wx.showToast({ title: '帮助中心开发中', icon: 'none' })
  },

  goToContact: function () {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567\n工作时间：9:00-18:00',
      showCancel: false
    })
  },

  goToLogin: function () {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  handleLogout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({ masterInfo: null })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }
})