function requireAuth() {
  if (wx.getStorageSync('sfds_authed') !== true) {
    wx.redirectTo({ url: '/pages/login/login' });
    return false;
  }
  return true;
}

module.exports = { requireAuth };
