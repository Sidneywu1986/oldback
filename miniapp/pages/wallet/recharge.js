const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    formData: {
      amount: ''
    },
    canSubmit: false
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
    this.setData({
      'formData.amount': amount
    })
    this.checkSubmit()
  },

  checkSubmit: function () {
    const amount = parseFloat(this.data.formData.amount)
    const canSubmit = amount >= 1 && !isNaN(amount)
    this.setData({ canSubmit })
  },

  submitRecharge: function () {
    if (!this.data.canSubmit) return

    const amount = parseFloat(this.data.formData.amount)

    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    request({
      url: '/fund/recharge',
      method: 'POST',
      data: { amount },
      loading: true
    })
      .then((res) => {
        const payData = res.data
        this.requestPayment(payData)
      })
      .catch((err) => {
        wx.showToast({ title: err.message || '充值失败', icon: 'none' })
      })
  },

  requestPayment: function (payData) {
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success: (res) => {
        wx.showToast({ title: '充值成功', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      },
      fail: (res) => {
        wx.showToast({ title: '支付失败', icon: 'none' })
      },
      complete: () => {
      }
    })
  }
})