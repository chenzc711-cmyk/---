const store = require('../../utils/storage');
const { requireAuth } = require('../../utils/auth');
const fields = ['date', 'name', 'spec', 'unitPrice', 'quantity', 'supplier', 'remark'];
Page({
  data: { form: { ...store.resetForm(fields), date: store.today() }, filterDate: '', records: [], selectedMap: {}, allSelected: false, editingId: '' },
  onShow() { if (requireAuth()) this.load(); },
  enrich(rows) { return rows.map(item => ({ ...item, amount: (store.toNumber(item.unitPrice) * store.toNumber(item.quantity)).toFixed(2) })); },
  load() { const all = store.list('inbound'); const rows = this.data.filterDate ? all.filter(item => item.date === this.data.filterDate) : all; this.setData({ records: this.enrich(rows), selectedMap: {}, allSelected: false }); },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }); },
  onDateChange(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }); },
  onFilterDate(e) { this.setData({ filterDate: e.detail.value }, () => this.load()); },
  clearFilter() { this.setData({ filterDate: '' }, () => this.load()); },
  saveRecord() { if (!this.data.form.date || !this.data.form.name) return wx.showToast({ title: '请填写日期和商品名称', icon: 'none' }); store.upsert('inbound', { ...this.data.form, id: this.data.editingId }); wx.showToast({ title: '已保存', icon: 'success' }); this.resetForm(); this.load(); },
  editRecord(e) { const record = store.list('inbound').find(item => item.id === e.currentTarget.dataset.id); if (record) this.setData({ form: { ...store.resetForm(fields), ...record }, editingId: record.id }); },
  resetForm() { this.setData({ form: { ...store.resetForm(fields), date: store.today() }, editingId: '' }); },
  toggleSelect(e) { const id = e.currentTarget.dataset.id; this.setData({ [`selectedMap.${id}`]: !this.data.selectedMap[id] }); },
  toggleSelectAll() { const next = !this.data.allSelected; const map = {}; this.data.records.forEach(item => { map[item.id] = next; }); this.setData({ selectedMap: map, allSelected: next }); },
  deleteSelected() { const ids = Object.keys(this.data.selectedMap).filter(id => this.data.selectedMap[id]); if (!ids.length) return wx.showToast({ title: '请先选择记录', icon: 'none' }); store.removeMany('inbound', ids); this.load(); }
});
