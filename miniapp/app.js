const { request } = require('./utils/request')

App({
  onLaunch: function () {
    console.log('飞玖回收小程序启动')
    this.checkLogin()
  },

  onShow: function () {
    console.log('小程序显示')
  },

  onHide: function () {
    console.log('小程序隐藏')
  },

  globalData: {
    userInfo: null,
    token: ''
  },

  checkLogin: function () {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      this.getUserInfo()
    }
  },

  getUserInfo: function () {
    request({ url: '/auth/me' })
      .then((res) => {
        this.globalData.userInfo = res.data
      })
      .catch(() => {
        wx.removeStorageSync('token')
        this.globalData.token = ''
      })
  },

  login: function (username, password, callback) {
    request({
      url: '/auth/login',
      method: 'POST',
      data: { username, password },
      loading: false
    })
      .then((res) => {
        const token = res.data.token
        this.globalData.token = token
        wx.setStorageSync('token', token)
        this.globalData.userInfo = res.data.user
        callback && callback(null, res.data)
      })
      .catch((err) => {
        callback && callback(err.message || '登录失败')
      })
  },

  logout: function () {
    wx.removeStorageSync('token')
    this.globalData.token = ''
    this.globalData.userInfo = null
  }
})
