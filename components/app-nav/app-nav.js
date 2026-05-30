Component({
  properties: {
    current: {
      type: String,
      value: ''
    }
  },
  data: {
    items: [
      { key: 'dashboard', text: '仪表盘', icon: '📊', url: '/pages/dashboard/dashboard' },
      { key: 'inventory', text: '库存', icon: '📦', url: '/pages/inventory/inventory' },
      { key: 'inbound', text: '入库', icon: '⬇️', url: '/pages/inbound/inbound' },
      { key: 'returns', text: '退货', icon: '↩️', url: '/pages/returns/returns' },
      { key: 'outbound', text: '出库', icon: '⬆️', url: '/pages/outbound/outbound' },
      { key: 'costs', text: '成本', icon: '¥', url: '/pages/costs/costs' }
    ]
  },
  methods: {
    goPage(event) {
      const { key, url } = event.currentTarget.dataset;
      if (key === this.properties.current) return;
      wx.redirectTo({ url });
    }
  }
});
