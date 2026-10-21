// One source for every number on the screens and slides. Sample shop, made-up bill.
export const shop = { name: 'Sharma Kirana', owner: 'Sharma ji', place: 'Sector 62, Noida' };

export const wholesaler = { name: 'Shree Balaji Traders', gstin: '09AAFCS4821K1Z3', invoice: 'SBT/2610/0418', date: '21 Oct 2026' };

// qty bought on this bill, rate paid, printed MRP, days this shop takes to sell one bill's worth
export const items = [
  { name: 'Fortune Sunflower Oil', pack: '1 L', qty: 24, rate: 148, mrp: 165, days: 6 },
  { name: 'Coca-Cola', pack: '750 ml', qty: 48, rate: 34, mrp: 40, days: 4 },
  { name: 'Aashirvaad Atta', pack: '5 kg', qty: 12, rate: 238, mrp: 260, days: 5 },
  { name: 'Maggi Masala', pack: '70 g', qty: 96, rate: 12.4, mrp: 14, days: 5 },
  { name: 'Parle-G', pack: '₹10 pack', qty: 144, rate: 9.1, mrp: 10, days: 6 },
  { name: 'Surf Excel Easy Wash', pack: '1 kg', qty: 20, rate: 118, mrp: 140, days: 24 },
  { name: 'Amul Butter', pack: '100 g', qty: 30, rate: 54, mrp: 58, days: 7 },
  { name: 'Tata Salt', pack: '1 kg', qty: 40, rate: 25.5, mrp: 28, days: 10 },
];

for (const it of items) {
  it.amount = it.qty * it.rate;
  it.marginPct = ((it.mrp - it.rate) / it.mrp) * 100;
  it.perWeek = (it.qty / it.days) * 7 * (it.mrp - it.rate); // rupees earned a week
  it.onShelf = (it.qty / 2) * it.rate;                       // average cash sitting in it
}

export const billTotal = Math.round(items.reduce((s, i) => s + i.amount, 0));

// the rest of the shop, from 13 other bills and 2 other wholesalers
export const otherItemsCount = 46;
export const otherPerWeek = 6880;
export const slowOthers = [
  { name: 'Horlicks', pack: '500 g', onShelf: 2960, days: 38 },
  { name: 'Dettol Soap', pack: '4 × 75 g', onShelf: 1840, days: 31 },
];
const otherOnShelf = 33400;

export const weekProfit = Math.round(items.reduce((s, i) => s + i.perWeek, 0) + otherPerWeek);
export const monthProfit = Math.round(weekProfit * 30 / 7 / 100) * 100;
export const onShelfTotal = Math.round((items.reduce((s, i) => s + i.onShelf, 0) + otherOnShelf) / 10) * 10;
export const blendedMargin = 14; // percent, matches weekProfit against weekly sales below
export const weekSales = Math.round(weekProfit / (blendedMargin / 100));
export const qrPerDay = 5400; // about 60% of daily sales come by QR
export const daySales = Math.round(weekSales / 7);
export const stockDays = Math.round(onShelfTotal / (daySales * (1 - blendedMargin / 100)));
export const monthBuying = Math.round(daySales * (1 - blendedMargin / 100) * 30 / 1000) * 1000;

// example stock-credit terms, shown as an example on every screen that uses them
export const credit = { amount: 15000, fee: 225, days: 30 };
credit.perDay = Math.ceil((credit.amount + credit.fee) / credit.days);
credit.shareOfQr = Math.round(credit.perDay / qrPerDay * 100);

export const inr = (n, d = 0) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

// credit from the wholesaler: the bill is due 7 days after delivery
export const dueDate = { short: '28 Oct', long: 'Wed, 28 Oct', remind: '27 Oct' };

// the shop's ledger for October: 14 bills from 3 wholesalers, adds up to monthBuying
export const ledger = [
  { name: 'Shree Balaji Traders', bills: 6, total: 102300, due: billTotal, dueOn: '28 Oct' },
  { name: 'Noida Cold Drinks Agency', bills: 3, total: 83800, due: 0 },
  { name: 'Gupta Dairy Supply', bills: 5, total: 48900, due: 0 },
];

// later: the same item cheaper from other sellers (example quotes, not real listings)
export const betterPrice = {
  item: 'Fortune Sunflower Oil', pack: '1 L', paying: 148, perMonth: 120,
  quotes: [{ seller: 'Agarwal Oil Depot', area: 'Sector 18, Noida', price: 141, min: '2 cartons' }, { seller: 'Shiv Shakti Traders', area: 'Ghaziabad', price: 143, min: '1 carton' }],
};
