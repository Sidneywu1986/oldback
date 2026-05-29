const app = getApp()
const { request } = require('../../utils/request')

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
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    request({
      url: '/recycle/orders/nearby',
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        radius: 5000
      }
    })
      .then((res) => {
        this.setData({
          nearbyOrders: res.data || [],
          loading: false
        })
      })
      .catch(() => {
        this.setData({ loading: false })
      })
  },

  loadGrabStats: function () {
    if (!app.globalData.token) return
    request({ url: '/recycle/orders/grab-stats' })
      .then((res) => {
        this.setData({
          grabCount: res.data.today_grab || 0,
          successRate: res.data.success_rate || 0
        })
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
    if (!app.globalData.token) return

    request({
      url: `/recycle/orders/${orderId}/grab`,
      method: 'POST',
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      loading: true
    })
      .then(() => {
        wx.showToast({ title: '抢单成功', icon: 'success' })
        this.loadNearbyOrders()
        this.loadGrabStats()
      })
      .catch((err) => {
        wx.showToast({ title: err.message || '抢单失败', icon: 'none' })
      })
  },

  showOrderDetail: function (e) {
    const order = e.currentTarget.dataset.order
    wx.navigateTo({ url: `/pages/orders/detail?id=${order.id}` })
  }
})