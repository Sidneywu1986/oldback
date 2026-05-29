const app = getApp()

Page({
  data: {
    currentAddress: '获取位置中...',
    latitude: 0,
    longitude: 0,
    nearbyOrders: [],
    grabCount: 0,
    successRate: 0,
    loading: true
  },

  onLoad: function () {
    this.getLocation()
    this.loadGrabStats()
  },

  onShow: function () {
    this.loadNearbyOrders()
  },

  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getAddress(res.latitude, res.longitude)
        this.loadNearbyOrders()
      },
      fail: () => {
        this.setData({
          currentAddress: '定位失败，请检查权限',
          loading: false
        })
        wx.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  },

  getAddress: function (latitude, longitude) {
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=your_qq_map_key`,
      success: (res) => {
        if (res.data.status === 0) {
          const address = res.data.result.address
          this.setData({ currentAddress: address })
        }
      }
    })
  },

  refreshLocation: function () {
    this.setData({ loading: true })
    this.getLocation()
  },

  loadNearbyOrders: function () {
    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders/nearby`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        radius: 5000
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            nearbyOrders: res.data.data || [],
            loading: false
          })
        }
      },
      fail: () => {
        this.setData({ loading: false })
      }
    })
  },

  loadGrabStats: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders/grab-stats`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            grabCount: res.data.data.today_grab || 0,
            successRate: res.data.data.success_rate || 0
          })
        }
      }
    })
  },

  grabOrder: function (e) {
    const orderId = e.currentTarget.dataset.id
    const orderNo = e.currentTarget.dataset.order_no

    wx.showModal({
      title: '确认抢单',
      content: `确定要抢单订单 ${orderNo} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doGrabOrder(orderId)
        }
      }
    })
  },

  doGrabOrder: function (orderId) {
    const token = app.globalData.token
    if (!token) return

    wx.showLoading({ title: '抢单中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders/${orderId}/grab`,
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.showToast({ title: '抢单成功', icon: 'success' })
          this.loadNearbyOrders()
          this.loadGrabStats()
        } else {
          wx.showToast({ title: res.data.msg || '抢单失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
    })
  },

  showOrderDetail: function (e) {
    const order = e.currentTarget.dataset.order
    wx.showModal({
      title: '订单详情',
      content: `订单号：${order.order_no}\n配件：${order.parts_name}\n数量：${order.quantity}件\n距离：${order.distance}km\n预估金额：¥${order.amount}`,
      showCancel: false
    })
  }
})