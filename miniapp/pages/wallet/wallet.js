const app = getApp()

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
    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.request({
      url: `${app.globalData.baseUrl}/fund/account`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ account: res.data.data })
        }
      }
    })
  },

  loadTransactions: function () {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/fund/transactions`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      data: { page: 1, size: 10 },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ transactions: res.data.data.list || [] })
        }
      }
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