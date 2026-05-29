const app = getApp()
const { request } = require('../../utils/request')

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
      this.setData({ orderId: id })
      this.loadOrder(id)
    }
  },

  onPullDownRefresh: function () {
    if (this.data.orderId) {
      this.loadOrder(this.data.orderId)
    }
    wx.stopPullDownRefresh()
  },

  loadOrder: function (id) {
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    request({ url: `/recycle/orders/${id}`, loading: true })
      .then((res) => {
        const order = res.data
        const images = order.images ? order.images.split(',') : []
        this.setData({
          order: order,
          images: images,
          ...this.getStatusInfo(order.status)
        })
      })
      .catch(() => {
        wx.showToast({ title: '获取订单失败', icon: 'none' })
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
  },

  copyOrderNo: function () {
    wx.setClipboardData({
      data: this.data.order.order_no || '',
      success: () => {
        wx.showToast({ title: '订单号已复制', icon: 'success' })
      }
    })
  },

  goToMaster: function () {
    const masterId = this.data.order.master_id
    if (masterId) {
      wx.navigateTo({ url: `/pages/profile/profile?masterId=${masterId}` })
    }
  },

  getActionButtons: function () {
    const status = this.data.order.status
    const buttons = []
    if (status === 0) {
      buttons.push({ text: '等待审核', type: 'primary', disabled: true })
    } else if (status === 1) {
      buttons.push({ text: '审核通过', type: 'primary', disabled: true })
    } else if (status === 2) {
      buttons.push({ text: '已驳回', type: 'warn', disabled: true })
    } else if (status === 3 || status === 4 || status === 7) {
      buttons.push({ text: '已完成', type: 'default', disabled: true })
    }
    return buttons
  }
})