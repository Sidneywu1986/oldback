const app = getApp()

Page({
  data: {
    order: {},
    images: [],
    statusText: '',
    statusDesc: '',
    statusBgColor: ''
  },

  onLoad: function (options) {
    const id = options.id
    if (id) {
      this.loadOrder(id)
    }
  },

  loadOrder: function (id) {
    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.showLoading({ title: '加载中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders/${id}`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          const order = res.data.data
          const images = order.images ? order.images.split(',') : []
          
          this.setData({
            order: order,
            images: images,
            ...this.getStatusInfo(order.status)
          })
        } else {
          wx.showToast({ title: '获取订单失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
    })
  },

  getStatusInfo: function (status) {
    const statusMap = {
      0: {
        text: '待审核',
        desc: '订单提交成功，等待管理员审核',
        bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
      },
      1: {
        text: '已通过',
        desc: '审核通过，积分已发放',
        bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
      },
      2: {
        text: '已拒绝',
        desc: '审核未通过，请查看审核意见',
        bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
      },
      3: {
        text: '已完成',
        desc: '订单已完成',
        bg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
      }
    }
    return statusMap[status] || { text: '未知', desc: '', bg: '#6B7280' }
  },

  previewImage: function (e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.images,
      current: this.data.images[index]
    })
  },

  goBack: function () {
    wx.navigateBack()
  },

  contactAdmin: function () {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567',
      showCancel: false
    })
  }
})