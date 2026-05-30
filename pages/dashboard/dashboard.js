const store = require('../../utils/storage');
const { requireAuth } = require('../../utils/auth');

function money(value) {
  return store.toNumber(value).toFixed(2);
}

function inDateMonth(date, month) {
  return String(date || '').slice(0, 7) === month;
}

Page({
  data: {},
  onShow() {
    if (!requireAuth()) return;
    this.refresh();
  },
  refresh() {
    const products = store.list('products');
    const inbound = store.list('inbound');
    const returns = store.list('returns');
    const outbound = store.list('outbound');
    const today = store.today();
    const month = store.currentMonth();

    const stockQty = products.reduce((sum, item) => sum + store.toNumber(item.stock), 0);
    const stockAmount = products.reduce((sum, item) => sum + store.toNumber(item.stock) * store.toNumber(item.unitPrice), 0);
    const warnings = products.filter(item => store.toNumber(item.stock) <= store.toNumber(item.warningQty));
    const todayInbound = inbound.filter(item => item.date === today);
    const todayOutbound = outbound.filter(item => item.date === today);
    const monthInbound = inbound.filter(item => inDateMonth(item.date, month));
    const monthOutbound = outbound.filter(item => inDateMonth(item.date, month));

    const sumQty = rows => rows.reduce((sum, item) => sum + store.toNumber(item.quantity), 0);
    const sumAmount = rows => rows.reduce((sum, item) => sum + store.toNumber(item.quantity) * store.toNumber(item.unitPrice || item.price), 0);
    const supplierBalance = inbound.reduce((sum, item) => sum + store.toNumber(item.quantity) * store.toNumber(item.unitPrice), 0)
      - outbound.reduce((sum, item) => sum + store.toNumber(item.quantity) * store.toNumber(item.unitPrice), 0);

    this.setData({
      warnings,
      monthInboundQty: sumQty(monthInbound),
      monthInboundAmount: money(sumAmount(monthInbound)),
      monthOutboundQty: sumQty(monthOutbound),
      monthOutboundAmount: money(sumAmount(monthOutbound)),
      metrics: [
        { label: '商品数量', value: products.length, note: '已建档 SKU' },
        { label: '库存数量', value: stockQty, note: '当前在库总件数' },
        { label: '库存总金额', value: `¥${money(stockAmount)}`, note: '按商品单价估算' },
        { label: '库存预警', value: warnings.length, note: '低于预警数量' },
        { label: '供应商货款余额', value: `¥${money(supplierBalance)}`, note: '入库应付 - 出库抵扣' },
        { label: '今日出库数量', value: sumQty(todayOutbound), note: `金额 ¥${money(sumAmount(todayOutbound))}` },
        { label: '今日入库数量', value: sumQty(todayInbound), note: `金额 ¥${money(sumAmount(todayInbound))}` },
        { label: '退货入库数量', value: returns.length, note: '累计退货登记' }
      ]
    });
  }
});
