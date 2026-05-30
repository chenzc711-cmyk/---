const store = require('../../utils/storage');
const { requireAuth } = require('../../utils/auth');
const fields = ['expenseDate', 'amount', 'purpose', 'category', 'remark'];
const categories = ['代发成本', '采购成本', '人工成本', '其他成本'];
Page({
  data: { categories, categoryIndex: -1, form: { ...store.resetForm(fields), expenseDate: store.today(), category: categories[0] }, filterDate: '', records: [], selectedMap: {}, allSelected: false, editingId: '' },
  onShow() { if (requireAuth()) this.load(); },
  load() { const all = store.list('costs'); const rows = this.data.filterDate ? all.filter(item => item.expenseDate === this.data.filterDate) : all; this.setData({ records: rows, selectedMap: {}, allSelected: false }); },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }); },
  onDateChange(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }); },
  onCategoryChange(e) { const index = Number(e.detail.value); this.setData({ categoryIndex: index, 'form.category': categories[index] }); },
  onFilterDate(e) { this.setData({ filterDate: e.detail.value }, () => this.load()); },
  clearFilter() { this.setData({ filterDate: '' }, () => this.load()); },
  saveRecord() { if (!this.data.form.expenseDate || !this.data.form.amount) return wx.showToast({ title: '请填写支出时间和金额', icon: 'none' }); store.upsert('costs', { ...this.data.form, id: this.data.editingId }); wx.showToast({ title: '已保存', icon: 'success' }); this.resetForm(); this.load(); },
  editRecord(e) { const record = store.list('costs').find(item => item.id === e.currentTarget.dataset.id); if (record) this.setData({ form: { ...store.resetForm(fields), ...record }, categoryIndex: categories.indexOf(record.category), editingId: record.id }); },
  resetForm() { this.setData({ form: { ...store.resetForm(fields), expenseDate: store.today(), category: categories[0] }, categoryIndex: 0, editingId: '' }); },
  toggleSelect(e) { const id = e.currentTarget.dataset.id; this.setData({ [`selectedMap.${id}`]: !this.data.selectedMap[id] }); },
  toggleSelectAll() { const next = !this.data.allSelected; const map = {}; this.data.records.forEach(item => { map[item.id] = next; }); this.setData({ selectedMap: map, allSelected: next }); },
  deleteSelected() { const ids = Object.keys(this.data.selectedMap).filter(id => this.data.selectedMap[id]); if (!ids.length) return wx.showToast({ title: '请先选择记录', icon: 'none' }); store.removeMany('costs', ids); this.load(); }
});
