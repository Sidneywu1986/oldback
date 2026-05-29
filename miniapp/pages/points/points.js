const app = getApp()

Page({
  data: {
    masterInfo: {},
    report: {},
    records: []
  },

  onLoad: function () {
    this.loadMasterInfo()
    this.loadPointsReport()
    this.loadPointsRecords()
  },

  loadMasterInfo: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/masters/me`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ masterInfo: res.data.data })
        }
      }
    })
  },

  loadPointsReport: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/reports/points`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ report: res.data.data })
        }
      }
    })
  },

  loadPointsRecords: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/fund/points-records`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      data: { page: 1, size: 20 },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ records: res.data.data.list || [] })
        }
      }
    })
  },

  getRecordIcon: function (type) {
    const iconMap = {
      'recycle': '♻️',
      'bonus': '🎁',
      'penalty': '⚠️',
      'exchange': '🛒',
      'withdraw': '💸'
    }
    return iconMap[type] || '📊'
  },

  getRecordBg: function (type) {
    const bgMap = {
      'recycle': '#10B981',
      'bonus': '#F59E0B',
      'penalty': '#EF4444',
      'exchange': '#8B5CF6',
      'withdraw': '#2563EB'
    }
    return bgMap[type] || '#6B7280'
  },

  getRecordType: function (type) {
    const typeMap = {
      'recycle': '回收获得',
      'bonus': '奖励积分',
      'penalty': '积分扣除',
      'exchange': '积分兑换',
      'withdraw': '积分提现'
    }
    return typeMap[type] || '其他'
  },

  goToExchange: function () {
    wx.showToast({ title: '兑换功能开发中', icon: 'none' })
  },

  goToWithdraw: function () {
    wx.showToast({ title: '提现功能开发中', icon: 'none' })
  }
})