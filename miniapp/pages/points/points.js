const app = getApp()
const { request } = require('../../utils/request')

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
    if (!app.globalData.token) return
    request({ url: '/masters/me' })
      .then((res) => {
        this.setData({ masterInfo: res.data })
      })
  },

  loadPointsReport: function () {
    if (!app.globalData.token) return
    request({ url: '/reports/points' })
      .then((res) => {
        this.setData({ report: res.data })
      })
  },

  loadPointsRecords: function () {
    if (!app.globalData.token) return
    request({ url: '/fund/points-records', data: { page: 1, size: 20 } })
      .then((res) => {
        this.setData({ records: res.data.list || [] })
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