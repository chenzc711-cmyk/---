Page({
  data: {
    code: ''
  },
  onLoad() {
    if (wx.getStorageSync('sfds_authed') === true) {
      wx.redirectTo({ url: '/pages/dashboard/dashboard' });
    }
  },
  onInput(event) {
    this.setData({ code: event.detail.value.trim() });
  },
  login() {
    const app = getApp();
    if (this.data.code === app.globalData.companyCode) {
      wx.setStorageSync('sfds_authed', true);
      wx.redirectTo({ url: '/pages/dashboard/dashboard' });
      return;
    }
    wx.showToast({ title: '公司代码不正确', icon: 'none' });
  }
});
