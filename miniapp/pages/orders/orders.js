const app = getApp()

Page({
  data: {
    currentTab: 'all',
    orders: [],
    loading: true,
    page: 1,
    size: 10
  },

  onLoad: function () {
    this.loadOrders()
  },

  onShow: function () {
    this.loadOrders()
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
      page: 1,
      orders: [],
      loading: true
    })
    this.loadOrders()
  },

  loadOrders: function () {
    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    const statusMap = {
      'all': '',
      'pending': 0,
      'approved': 1,
      'rejected': 2
    }

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      data: {
        page: this.data.page,
        size: this.data.size,
        status: statusMap[this.data.currentTab]
      },
      success: (res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.setData({
            orders: data.list || [],
            loading: false
          })
        }
      },
      fail: () => {
        this.setData({ loading: false })
      }
    })
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/orders/detail?id=${id}` })
  },

  previewImage: function (e) {
    const url = e.currentTarget.dataset.url
    const list = e.currentTarget.dataset.list.split(',')
    wx.previewImage({
      urls: list,
      current: url
    })
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
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, orders: [], loading: true })
    this.loadOrders()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    if (this.data.loading) return
    this.setData({ page: this.data.page + 1, loading: true })
    this.loadOrders()
  }
})