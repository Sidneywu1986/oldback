const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    todayStats: {
      recycleCount: 0,
      pointsEarned: 0,
      orderAmount: '0.00'
    },
    categories: [
      { id: 1, name: '发动机', icon: '⚙️', pointsRatio: 2.5 },
      { id: 2, name: '变速箱', icon: '🔧', pointsRatio: 2.0 },
      { id: 3, name: '车门', icon: '🚪', pointsRatio: 1.5 },
      { id: 4, name: '轮胎', icon: '🛞', pointsRatio: 0.5 },
      { id: 5, name: '电瓶', icon: '🔋', pointsRatio: 0.8 },
      { id: 6, name: '座椅', icon: '💺', pointsRatio: 0.6 },
      { id: 7, name: '仪表盘', icon: '📊', pointsRatio: 1.2 },
      { id: 8, name: '空调', icon: '❄️', pointsRatio: 1.8 }
    ],
    recentOrders: []
  },

  onLoad: function () {
    this.loadTodayStats()
    this.loadRecentOrders()
  },

  loadTodayStats: function () {
    if (!app.globalData.token) return
    request({ url: '/dashboard/stats' })
      .then((res) => {
        this.setData({ todayStats: res.data })
      })
  },

  loadRecentOrders: function () {
    if (!app.globalData.token) return
    request({ url: '/recycle/orders', data: { page: 1, size: 3 } })
      .then((res) => {
        this.setData({ recentOrders: res.data.list || [] })
      })
  },

  goToRecycle: function () {
    wx.switchTab({ url: '/pages/recycle/recycle' })
  },

  goToGrab: function () {
    wx.navigateTo({ url: '/pages/orders/grab' })
  },

  goToOrders: function () {
    wx.switchTab({ url: '/pages/orders/orders' })
  },

  goToPoints: function () {
    wx.switchTab({ url: '/pages/points/points' })
  },

  goToProfile: function () {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  goToCategory: function () {
    wx.navigateTo({ url: '/pages/recycle/recycle' })
  },

  selectCategory: function (e) {
    const categoryId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/recycle/recycle?category=${categoryId}` })
  },

  goToOrderDetail: function (e) {
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/orders/detail?id=${orderId}` })
  },

  getStatusText: function (status) {
    const statusMap = {
      0: '待审核',
      1: '已通过',
      2: '已拒绝',
      3: '已完成'
    }
    return statusMap[status] || '未知'
  },

  getStatusColor: function (status) {
    const colorMap = {
      0: '#F59E0B',
      1: '#10B981',
      2: '#EF4444',
      3: '#2563EB'
    }
    return colorMap[status] || '#9CA3AF'
  }
})