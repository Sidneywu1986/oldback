const app = getApp()

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
          this.setData({ balance: res.data.data.balance || '0.00' })
        }
      }
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
    const token = app.globalData.token
    if (!token) return

    wx.showLoading({ title: '处理中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/fund/withdraw`,
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: { amount },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.showToast({ title: '提现申请已提交', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({ title: res.data.msg || '提现失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
    })
  }
})