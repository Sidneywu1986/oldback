const app = getApp()
const { request } = require('../../utils/request')

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
    if (!app.globalData.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    request({ url: '/promotions/user-activities', loading: true })
      .then((res) => {
        this.setData({ activities: res.data || [] })
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
      .finally(() => {
        this.setData({ loading: false })
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
    if (!app.globalData.token) return

    request({
      url: `/promotions/activities/${activityId}/participate`,
      method: 'POST'
    })
      .then(() => {
        wx.showToast({ title: '参与成功', icon: 'success' })
        this.loadActivities()
      })
      .catch((err) => {
        wx.showToast({ title: err.message || '参与失败', icon: 'none' })
      })
  }
})