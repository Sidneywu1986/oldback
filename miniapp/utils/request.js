/**
 * 统一请求封装
 * - 自动带 token
 * - 统一错误处理
 * - 返回 Promise
 */

const ENV = {
  dev: {
    // 开发者工具模拟器可用 localhost；真机调试需改为电脑内网 IP
    baseUrl: 'http://localhost:8000/api/v1'
  },
  prod: {
    baseUrl: 'https://api.example.com/api/v1'
  }
}

const CURRENT_ENV = 'dev'

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const baseUrl = options.baseUrl || ENV[CURRENT_ENV].baseUrl

    if (options.loading !== false) {
      wx.showLoading({ title: '加载中...', mask: true })
    }

    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success: (res) => {
        if (options.loading !== false) wx.hideLoading()

        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/login/login' })
          }, 1500)
          return reject(new Error('Unauthorized'))
        }

        const data = res.data || {}
        if (data.code !== 200 && data.code !== undefined && data.code !== 0) {
          wx.showToast({ title: data.message || data.msg || '请求失败', icon: 'none' })
          return reject(new Error(data.message || data.msg))
        }

        resolve(data)
      },
      fail: (err) => {
        if (options.loading !== false) wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

module.exports = { request, ENV, CURRENT_ENV }
