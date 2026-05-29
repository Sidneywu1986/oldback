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
    token: '',
    baseUrl: 'https://api.example.com/api/v1'
  },
  
  checkLogin: function () {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      this.getUserInfo()
    }
  },
  
  getUserInfo: function () {
    const token = this.globalData.token
    if (!token) return
    
    wx.request({
      url: `${this.globalData.baseUrl}/auth/me`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.globalData.userInfo = res.data.data
        }
      },
      fail: () => {
        wx.removeStorageSync('token')
        this.globalData.token = ''
      }
    })
  },
  
  login: function (phone, password, callback) {
    wx.request({
      url: `${this.globalData.baseUrl}/auth/login`,
      method: 'POST',
      data: { phone, password },
      success: (res) => {
        if (res.data.code === 200) {
          const token = res.data.data.access_token
          this.globalData.token = token
          wx.setStorageSync('token', token)
          this.getUserInfo()
          callback && callback(null, res.data.data)
        } else {
          callback && callback(res.data.msg || '登录失败')
        }
      },
      fail: () => {
        callback && callback('网络请求失败')
      }
    })
  },
  
  logout: function () {
    wx.removeStorageSync('token')
    this.globalData.token = ''
    this.globalData.userInfo = null
  }
})