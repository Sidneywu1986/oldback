const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    account: {},
    transactions: []
  },

  onLoad: function () {
    this.loadAccountInfo()
    this.loadTransactions()
  },

  loadAccountInfo: function () {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    request({ url: '/fund/account' })
      .then((res) => {
        this.setData({ account: res.data })
      })
  },

  loadTransactions: function () {
    if (!app.globalData.token) return
    request({ url: '/fund/transactions', data: { page: 1, size: 10 } })
      .then((res) => {
        this.setData({ transactions: res.data.list || [] })
      })
  },

  getTxnIcon: function (type) {
    const iconMap = {
      'recycle_award': '♻️',
      'withdraw': '💸',
      'recharge': '💳',
      'transfer': '🔄',
      'adjust': '⚙️'
    }
    return iconMap[type] || '📊'
  },

  getTxnBg: function (type) {
    const bgMap = {
      'recycle_award': '#10B981',
      'withdraw': '#EF4444',
      'recharge': '#2563EB',
      'transfer': '#F59E0B',
      'adjust': '#6B7280'
    }
    return bgMap[type] || '#6B7280'
  },

  getTxnType: function (type) {
    const typeMap = {
      'recycle_award': '回收奖励',
      'withdraw': '提现',
      'recharge': '充值',
      'transfer': '转账',
      'adjust': '调整'
    }
    return typeMap[type] || '其他'
  },

  goToWithdraw: function () {
    wx.navigateTo({ url: '/pages/wallet/withdraw' })
  },

  goToRecharge: function () {
    wx.navigateTo({ url: '/pages/wallet/recharge' })
  },

  goToTransfer: function () {
    wx.showToast({ title: '转账功能开发中', icon: 'none' })
  },

  goToRecords: function () {
    wx.navigateTo({ url: '/pages/wallet/records' })
  }
})