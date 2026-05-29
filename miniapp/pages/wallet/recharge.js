const app = getApp()

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

    wx.showLoading({ title: '正在发起支付...' })

    const token = app.globalData.token
    if (!token) {
      wx.hideLoading()
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.request({
      url: `${app.globalData.baseUrl}/fund/recharge`,
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: { amount },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          const payData = res.data.data
          this.requestPayment(payData)
        } else {
          wx.showToast({ title: res.data.msg || '充值失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
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