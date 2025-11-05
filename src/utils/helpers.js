// src/utils/helpers.js
export function calculateTotals(transactions) {
  let income = 0, expense = 0;
  (transactions || []).forEach(t => {
    if (t.type === 'income') income += Number(t.amount || 0);
    else expense += Number(t.amount || 0);
  });
  return { income, expense, balance: income - expense };
}

/**
 * groupByMonthDetailed:
 * returns array of { month: 'YYYY-MM', income: number, expense: number, net: number }
 */
export function groupByMonthDetailed(transactions = []) {
  const map = {};
  (transactions || []).forEach(t => {
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = map[key] || { income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += Number(t.amount || 0);
    else map[key].expense += Number(t.amount || 0);
  });

  return Object.keys(map).sort().map(k => {
    const { income = 0, expense = 0 } = map[k];
    return { month: k, income, expense, net: income - expense };
  });
}

/**
 * groupByCategory: returns array [{ name: 'Food', value: number }, ...]
 * We sum absolute amounts per category (magnitude).
 */
export function groupByCategory(transactions = [], categories = []) {
  const map = {};
  (transactions || []).forEach(t => {
    const cat = (categories || []).find(c => c.id === t.category);
    const name = cat ? cat.name : (t.category || 'Other');
    map[name] = (map[name] || 0) + Number(t.amount || 0);
  });
  return Object.keys(map).map(k => ({ name: k, value: map[k] }));
}
