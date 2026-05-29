const app = getApp()

Page({
  data: {
    categories: [],
    selectedCategory: null,
    formData: {
      partsName: '',
      partsCode: '',
      quantity: 1,
      weight: '',
      remark: ''
    },
    images: [],
    estimatedPoints: 0,
    estimatedAmount: '0.00',
    canSubmit: false
  },

  onLoad: function () {
    this.loadCategories()
  },

  loadCategories: function () {
    wx.request({
      url: `${app.globalData.baseUrl}/recycle/parts-categories`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            categories: res.data.data || []
          })
        }
      }
    })
  },

  getIcon: function (id) {
    const icons = ['⚙️', '🔧', '🚪', '🛞', '🔋', '💺', '📊', '❄️', '💡', '📦']
    return icons[id - 1] || '📦'
  },

  selectCategory: function (e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    const ratio = parseFloat(e.currentTarget.dataset.ratio)
    
    this.setData({
      selectedCategory: { id, name, ratio }
    })
    
    this.calculateEstimate()
  },

  onPartsNameInput: function (e) {
    this.setData({
      'formData.partsName': e.detail.value
    })
    this.calculateEstimate()
    this.checkSubmit()
  },

  onPartsCodeInput: function (e) {
    this.setData({
      'formData.partsCode': e.detail.value
    })
  },

  decreaseQty: function () {
    const qty = this.data.formData.quantity
    if (qty > 1) {
      this.setData({
        'formData.quantity': qty - 1
      })
      this.calculateEstimate()
    }
  },

  increaseQty: function () {
    const qty = this.data.formData.quantity
    if (qty < 999) {
      this.setData({
        'formData.quantity': qty + 1
      })
      this.calculateEstimate()
    }
  },

  onQuantityInput: function (e) {
    const qty = parseInt(e.detail.value) || 1
    this.setData({
      'formData.quantity': Math.max(1, Math.min(999, qty))
    })
    this.calculateEstimate()
    this.checkSubmit()
  },

  onWeightInput: function (e) {
    this.setData({
      'formData.weight': e.detail.value
    })
    this.calculateEstimate()
  },

  onRemarkInput: function (e) {
    this.setData({
      'formData.remark': e.detail.value
    })
  },

  calculateEstimate: function () {
    const { quantity, weight } = this.data.formData
    const { selectedCategory } = this.data
    
    let points = 0
    let amount = 0
    
    if (selectedCategory) {
      const basePoints = quantity * 10 * selectedCategory.ratio
      const weightBonus = weight ? parseFloat(weight) * 5 : 0
      points = Math.round(basePoints + weightBonus)
      amount = (points / 10).toFixed(2)
    }
    
    this.setData({
      estimatedPoints: points,
      estimatedAmount: amount
    })
  },

  checkSubmit: function () {
    const { selectedCategory, formData } = this.data
    const hasCategory = selectedCategory !== null
    const hasName = formData.partsName.trim() !== ''
    const hasQty = formData.quantity >= 1
    
    this.setData({
      canSubmit: hasCategory && hasName && hasQty
    })
  },

  chooseImage: function () {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
      }
    })
  },

  previewImage: function (e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.images,
      current: this.data.images[index]
    })
  },

  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  submitOrder: function () {
    if (!this.data.canSubmit) return

    const token = app.globalData.token
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    const data = {
      parts_type: this.data.selectedCategory.id,
      parts_name: this.data.formData.partsName,
      parts_code: this.data.formData.partsCode,
      quantity: this.data.formData.quantity,
      weight: this.data.formData.weight ? parseFloat(this.data.formData.weight) : null,
      remark: this.data.formData.remark,
      images: this.data.images.join(',')
    }

    wx.showLoading({ title: '提交中...' })

    wx.request({
      url: `${app.globalData.baseUrl}/recycle/orders`,
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: data,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.showModal({
            title: '提交成功',
            content: '回收申请已提交，请等待审核',
            showCancel: false,
            success: () => {
              wx.switchTab({ url: '/pages/orders/orders' })
            }
          })
        } else {
          wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络请求失败', icon: 'none' })
      }
    })
  }
})