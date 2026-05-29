const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    balance: '0.00',
    formData: {
      amount: ''
    },
    canSubmit: false
  },

  onLoad: function () {
    this.loadBalance()
  },

  loadBalance: function () {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    request({ url: '/fund/account' })
      .then((res) => {
        this.setData({ balance: res.data.balance || '0.00' })
      })
  },

  onAmountInput: function (e) {
    const value = e.detail.value
    this.setData({
      'formData.amount': value
    })
    this.checkSubmit()
  },

  setQuickAmount: function (e) {
    const amount = e.currentTarget.dataset.amount
    if (amount === 'all') {
      this.setData({
        'formData.amount': this.data.balance
      })
    } else {
      this.setData({
        'formData.amount': amount
      })
    }
    this.checkSubmit()
  },

  checkSubmit: function () {
    const amount = parseFloat(this.data.formData.amount)
    const balance = parseFloat(this.data.balance)
    const canSubmit = amount >= 1 && amount <= balance && !isNaN(amount)
    this.setData({ canSubmit })
  },

  submitWithdraw: function () {
    if (!this.data.canSubmit) return

    const amount = parseFloat(this.data.formData.amount)

    wx.showModal({
      title: '确认提现',
      content: `确定要提现 ¥${amount} 到微信零钱吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doWithdraw(amount)
        }
      }
    })
  },

  doWithdraw: function (amount) {
    if (!app.globalData.token) return

    request({
      url: '/fund/withdraw',
      method: 'POST',
      data: { amount },
      loading: true
    })
      .then(() => {
        wx.showToast({ title: '提现申请已提交', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      })
      .catch((err) => {
        wx.showToast({ title: err.message || '提现失败', icon: 'none' })
      })
  }
})