App({
  globalData: {
    companyCode: 'sfds'
  },
  onLaunch() {
    const authed = wx.getStorageSync('sfds_authed') === true;
    const pages = getCurrentPages();
    if (!authed && pages.length) {
      wx.redirectTo({ url: '/pages/login/login' });
    }
  }
});
