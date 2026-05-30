const store = require('../../utils/storage');
const { requireAuth } = require('../../utils/auth');
const fields = ['category', 'name', 'spec', 'unitPrice', 'stock', 'supplier', 'remark', 'warningQty'];

Page({
  data: { form: store.resetForm(fields), records: [], selectedMap: {}, allSelected: false, editingId: '' },
  onShow() { if (requireAuth()) this.load(); },
  load() { this.setData({ records: store.list('products'), selectedMap: {}, allSelected: false }); },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }); },
  saveRecord() {
    if (!this.data.form.name) return wx.showToast({ title: '请填写商品名称', icon: 'none' });
    store.upsert('products', { ...this.data.form, id: this.data.editingId });
    wx.showToast({ title: this.data.editingId ? '已修改' : '已添加', icon: 'success' });
    this.resetForm(); this.load();
  },
  editRecord(e) {
    const record = this.data.records.find(item => item.id === e.currentTarget.dataset.id);
    if (record) this.setData({ form: { ...store.resetForm(fields), ...record }, editingId: record.id });
  },
  resetForm() { this.setData({ form: store.resetForm(fields), editingId: '' }); },
  toggleSelect(e) { const id = e.currentTarget.dataset.id; this.setData({ [`selectedMap.${id}`]: !this.data.selectedMap[id] }); },
  toggleSelectAll() { const next = !this.data.allSelected; const map = {}; this.data.records.forEach(item => { map[item.id] = next; }); this.setData({ selectedMap: map, allSelected: next }); },
  deleteSelected() { const ids = Object.keys(this.data.selectedMap).filter(id => this.data.selectedMap[id]); if (!ids.length) return wx.showToast({ title: '请先选择记录', icon: 'none' }); store.removeMany('products', ids); this.load(); }
});
