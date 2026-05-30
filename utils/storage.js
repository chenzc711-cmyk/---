const KEY_PREFIX = 'sfds_warehouse_';

const defaultProducts = [
  {
    id: 'p-demo-hoodie',
    category: '天猫爆款',
    name: '拾纷联名卫衣',
    spec: '黑色 / L',
    unitPrice: 129,
    stock: 86,
    supplier: '杭州织造供应链',
    remark: '秋冬主推款',
    warningQty: 20
  },
  {
    id: 'p-demo-cup',
    category: '周边礼品',
    name: '猫头保温杯',
    spec: '红色 / 500ml',
    unitPrice: 59,
    stock: 12,
    supplier: '义乌优品贸易',
    remark: '低库存需关注',
    warningQty: 15
  }
];

const emptyState = {
  products: defaultProducts,
  inbound: [],
  returns: [],
  outbound: [],
  costs: []
};

function key(name) {
  return `${KEY_PREFIX}${name}`;
}

function ensure(name) {
  const value = wx.getStorageSync(key(name));
  if (value) return value;
  const initial = emptyState[name] || [];
  wx.setStorageSync(key(name), initial);
  return initial;
}

function list(name) {
  return ensure(name);
}

function save(name, items) {
  wx.setStorageSync(key(name), items);
  return items;
}

function upsert(name, record) {
  const records = list(name);
  const current = {
    ...record,
    id: record.id || `${name}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  };
  const index = records.findIndex(item => item.id === current.id);
  if (index > -1) {
    records.splice(index, 1, current);
  } else {
    records.unshift(current);
  }
  return save(name, records);
}

function removeMany(name, ids) {
  const targets = new Set(ids);
  return save(name, list(name).filter(item => !targets.has(item.id)));
}

function resetForm(fields) {
  return fields.reduce((form, field) => ({ ...form, [field]: '' }), {});
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return today().slice(0, 7);
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

module.exports = {
  list,
  save,
  upsert,
  removeMany,
  resetForm,
  today,
  currentMonth,
  toNumber
};
