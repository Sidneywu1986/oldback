const app = getApp()

Page({
  data: {
    activities: [],
    loading: true
  },

  onLoad: function () {
    this.loadActivities()
  },

  onShow: function () {
    this.loadActivities()
  },

  loadActivities: function () {
    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    wx.showLoading({ title: '加载中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/promotions/user-activities`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          this.setData({ activities: res.data.data || [] })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '加载失败', icon: 'none' })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  getActivityTypeIcon: function (type) {
    const iconMap = {
      'discount': '🏷️',
      'full_reduction': '💰',
      'points_double': '⭐',
      'new_user_gift': '🎁'
    }
    return iconMap[type] || '🎯'
  },

  formatTime: function (time) {
    if (!time) return '长期'
    const date = new Date(time)
    return `${date.getMonth() + 1}/${date.getDate()}`
  },

  showActivityDetail: function (e) {
    const activity = e.currentTarget.dataset.activity
    wx.showModal({
      title: activity.name,
      content: `活动类型：${activity.activity_type_label}\n\n活动规则：${this.getRuleDesc(activity)}\n\n有效期：${this.formatTime(activity.start_time)} - ${this.formatTime(activity.end_time)}`,
      confirmText: '立即参与',
      success: (res) => {
        if (res.confirm) {
          this.participateActivity(activity.id)
        }
      }
    })
  },

  getRuleDesc: function (activity) {
    const rules = activity.rules || {}
    switch (activity.activity_type) {
      case 'full_reduction':
        return `满¥${rules.threshold}减¥${rules.discount}`
      case 'discount':
        return `${(rules.rate * 10).toFixed(1)}折优惠`
      case 'points_double':
        return `积分${rules.multiplier}倍`
      case 'new_user_gift':
        return `赠送${rules.points}积分`
      default:
        return '查看详情'
    }
  },

  participateActivity: function (activityId) {
    const token = app.globalData.token
    if (!token) return

    wx.request({
      url: `${app.globalData.baseUrl}/promotions/activities/${activityId}/participate`,
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '参与成功', icon: 'success' })
          this.loadActivities()
        } else {
          wx.showToast({ title: res.data.msg || '参与失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
    })
  }
})