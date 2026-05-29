const app = getApp()

Page({
  data: {
    formData: {
      phone: '',
      password: ''
    },
    rememberMe: false,
    canSubmit: false
  },

  onLoad: function () {
    const savedPhone = wx.getStorageSync('savedPhone')
    if (savedPhone) {
      this.setData({
        'formData.phone': savedPhone,
        rememberMe: true
      })
    }
  },

  onPhoneInput: function (e) {
    this.setData({
      'formData.phone': e.detail.value
    })
    this.checkSubmit()
  },

  onPasswordInput: function (e) {
    this.setData({
      'formData.password': e.detail.value
    })
    this.checkSubmit()
  },

  toggleRemember: function () {
    this.setData({
      rememberMe: !this.data.rememberMe
    })
  },

  checkSubmit: function () {
    const { phone, password } = this.data.formData
    const hasPhone = phone.length === 11
    const hasPassword = password.length >= 6
    this.setData({
      canSubmit: hasPhone && hasPassword
    })
  },

  handleLogin: function () {
    if (!this.data.canSubmit) return

    const { phone, password } = this.data.formData

    wx.showLoading({ title: '登录中...' })

    app.login(phone, password, (err, data) => {
      wx.hideLoading()
      if (err) {
        wx.showToast({ title: err, icon: 'none' })
        return
      }

      if (this.data.rememberMe) {
        wx.setStorageSync('savedPhone', phone)
      } else {
        wx.removeStorageSync('savedPhone')
      }

      wx.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    })
  },

  goToForgot: function () {
    wx.showToast({ title: '请联系管理员重置密码', icon: 'none' })
  }
})