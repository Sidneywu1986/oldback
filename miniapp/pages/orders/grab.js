const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    currentAddress: '获取位置中...',
    latitude: 39.9042,
    longitude: 116.4074,
    scale: 13,
    nearbyOrders: [],
    rawMarkers: [],
    markers: [],
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
        const orders = res.data || []
        const rawMarkers = orders.map((item, index) => ({
          _idx: index,
          latitude: item.lat || this.data.latitude,
          longitude: item.lng || this.data.longitude,
          parts_name: item.parts_name,
          amount: item.amount,
          order: item
        }))
        const markers = this.clusterMarkers(rawMarkers, this.data.scale)
        this.setData({
          nearbyOrders: orders,
          rawMarkers: rawMarkers,
          markers: markers,
          loading: false
        })
      })
      .catch(() => {
        this.setData({ loading: false })
      })
  },

  // 网格聚类：根据缩放级别合并近距离标记
  clusterMarkers: function (rawMarkers, scale) {
    if (rawMarkers.length <= 10 || scale >= 15) {
      return rawMarkers.map((m) => ({
        id: m._idx,
        latitude: m.latitude,
        longitude: m.longitude,
        title: m.parts_name,
        iconPath: '/images/marker.png',
        width: 30,
        height: 30,
        callout: {
          content: `${m.parts_name} ¥${m.amount}`,
          color: '#1F2937',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#FFFFFF',
          padding: 8,
          display: 'ALWAYS'
        }
      }))
    }

    // 网格大小根据 scale 调整：scale 越小，网格越大
    // 0.001 度 ≈ 111m
    const gridSize = scale >= 13 ? 0.003 : 0.006

    const clusters = {}
    rawMarkers.forEach((m) => {
      const gx = Math.floor(m.longitude / gridSize)
      const gy = Math.floor(m.latitude / gridSize)
      const key = `${gx},${gy}`
      if (!clusters[key]) {
        clusters[key] = { items: [], totalLat: 0, totalLng: 0 }
      }
      clusters[key].items.push(m)
      clusters[key].totalLat += m.latitude
      clusters[key].totalLng += m.longitude
    })

    let clusterIdx = 0
    const markers = []
    Object.values(clusters).forEach((c) => {
      const count = c.items.length
      const avgLat = c.totalLat / count
      const avgLng = c.totalLng / count

      if (count === 1) {
        const m = c.items[0]
        markers.push({
          id: m._idx,
          latitude: avgLat,
          longitude: avgLng,
          title: m.parts_name,
          iconPath: '/images/marker.png',
          width: 30,
          height: 30,
          callout: {
            content: `${m.parts_name} ¥${m.amount}`,
            color: '#1F2937',
            fontSize: 12,
            borderRadius: 8,
            bgColor: '#FFFFFF',
            padding: 8,
            display: 'ALWAYS'
          }
        })
      } else {
        markers.push({
          id: 10000 + clusterIdx,
          latitude: avgLat,
          longitude: avgLng,
          title: `${count}个订单`,
          iconPath: '/images/cluster.png',
          width: 44,
          height: 44,
          callout: {
            content: `附近${count}个回收订单`,
            color: '#1F2937',
            fontSize: 12,
            borderRadius: 8,
            bgColor: '#FFFFFF',
            padding: 8,
            display: 'ALWAYS'
          }
        })
        clusterIdx++
      }
    })

    return markers
  },

  // 监听地图视野变化（缩放/拖动）
  onRegionChange: function (e) {
    if (e.type === 'end') {
      const mapCtx = wx.createMapContext('nearbyMap')
      mapCtx.getScale({
        success: (res) => {
          const newScale = Math.round(res.scale)
          if (newScale !== this.data.scale) {
            const markers = this.clusterMarkers(this.data.rawMarkers, newScale)
            this.setData({ scale: newScale, markers: markers })
          }
        }
      })
    }
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
  },

  onMarkerTap: function (e) {
    const markerId = e.markerId
    if (markerId >= 10000) {
      // 点击聚合标记，放大地图
      this.setData({ scale: 16 })
      const markers = this.clusterMarkers(this.data.rawMarkers, 16)
      this.setData({ markers: markers })
      return
    }
    const order = this.data.nearbyOrders[markerId]
    if (order) {
      wx.navigateTo({ url: `/pages/orders/detail?id=${order.id}` })
    }
  }
})
