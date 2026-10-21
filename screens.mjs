// Builds every app screen as HTML from data.mjs, then screenshots each at 3x with Puppeteer.
// node screens.mjs            -> shots/*.png
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import * as D from './data.mjs';

const { inr } = D;
const here = path.dirname(new URL(import.meta.url).pathname);
const icon = (name, cls = '') => `<i class="ic ${cls}" style="--src:url(https://unpkg.com/lucide-static@0.460.0/icons/${name}.svg)"></i>`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600&display=block');
:root{--bg:#f6f6f7;--card:#fff;--ink:#111214;--sub:#6c6d73;--line:#ececee;--navy:#002e6e;--sky:#00baf2;--ok:#138a4b;}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:390px;height:844px;background:transparent}
body{font-family:Inter,-apple-system,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;font-feature-settings:"tnum" 1,"cv11" 1}
.phone{position:relative;width:390px;height:844px;border-radius:46px;overflow:hidden;background:var(--bg)}
.phone.dark{background:#0b0b0c;color:#fff}
.status{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 44px;font-weight:600;font-size:17px;z-index:20}
.island{position:absolute;left:50%;top:11px;width:124px;height:36px;border-radius:20px;background:#000;transform:translateX(-50%)}
.sicons{display:flex;gap:6px;align-items:center}
.ic{display:inline-block;width:22px;height:22px;background:currentColor;-webkit-mask:var(--src) center/contain no-repeat;mask:var(--src) center/contain no-repeat;flex:none}
.scroll{position:absolute;inset:54px 0 0 0;padding:8px 20px 140px;overflow:hidden}
h1{font-size:34px;font-weight:800;letter-spacing:-.02em;margin:18px 4px 4px}
.lead{font-size:15px;color:var(--sub);margin:0 4px 18px;line-height:1.4}
.card{background:var(--card);border-radius:26px;padding:20px;margin-bottom:14px}
.big{font-size:40px;font-weight:800;letter-spacing:-.03em}
.sub{color:var(--sub);font-size:14px;line-height:1.4}
.row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.hr{height:1px;background:var(--line);margin:14px 0}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;height:54px;border-radius:999px;background:var(--navy);color:#fff;font-weight:700;font-size:17px;width:100%}
.btn.light{background:#fff;color:var(--navy)}
.tabbar{position:absolute;left:16px;right:16px;bottom:28px;display:flex;gap:10px;z-index:10}
.tabbar .lg{height:64px}
.tabs{flex:1;display:flex;align-items:center;justify-content:space-around;padding:0 6px}
.tab{height:52px;flex:1;display:flex;align-items:center;justify-content:center;border-radius:999px;color:#1b1b1d}
.tab.on{background:rgba(0,0,0,.07);color:var(--navy)}
.tab .ic{width:26px;height:26px}
.fab{width:64px;display:flex;align-items:center;justify-content:center;color:var(--navy)}
.fab .ic{width:28px;height:28px}
.bottom{position:absolute;left:16px;right:16px;bottom:28px;z-index:10;padding:8px;border-radius:36px}
.lg{--lg-tint:rgba(255,255,255,.62)}
.dark .lg{--lg-tint:rgba(40,40,44,.45);--lg-edge:rgba(255,255,255,.3);color:#fff}
.fade{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(rgba(246,246,247,0),var(--bg) 70%);z-index:5}
.chip{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--ok)}
.chip .ic{width:16px;height:16px}
.deva{font-family:"Noto Sans Devanagari",Inter,sans-serif}
`;

const status = (dark) => `<div class="status" style="color:${dark ? '#fff' : '#000'}"><span>9:41</span><div class="island"></div><span class="sicons">${icon('signal')}${icon('wifi')}${icon('battery-full', '')}</span></div>`;
const tabbar = (on) => `<div class="tabbar"><div class="lg tabs">
  <div class="tab ${on === 'home' ? 'on' : ''}">${icon('house')}</div>
  <div class="tab ${on === 'munafa' ? 'on' : ''}">${icon('chart-no-axes-column')}</div>
  <div class="tab ${on === 'bills' ? 'on' : ''}">${icon('receipt-text')}</div>
  </div><div class="lg fab">${icon('scan-line')}</div></div>`;
const page = (body, { dark = false } = {}) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="liquid-glass.css"><style>${css}</style></head>
<body><div class="phone ${dark ? 'dark' : ''}">${status(dark)}${body}</div></body></html>`;

const top3 = [...D.items].sort((a, b) => b.perWeek - a.perWeek);
const surf = D.items.find(i => i.name.startsWith('Surf'));
const coke = D.items.find(i => i.name.startsWith('Coca'));

// the photographed bill, used inside the scanner
const billPaper = `<div class="paper">
  <div class="pc">${D.wholesaler.name.toUpperCase()}</div>
  <div class="pc s">Wholesale FMCG · Sector 63, Noida</div>
  <div class="pc s">GSTIN ${D.wholesaler.gstin}</div>
  <div class="dash"></div>
  <div class="pr s" style="white-space:nowrap"><b style="font-weight:400">Inv ${D.wholesaler.invoice}</b><b style="font-weight:400">${D.wholesaler.date}</b></div>
  <div class="pr s"><b style="font-weight:400">To: ${D.shop.name.toUpperCase()}, SEC 62</b></div>
  <div class="dash"></div>
  <div class="pr s" style="font-weight:700"><span class="n">Item</span><span>Qty</span><span>MRP</span><span>Rate</span><span>Amt</span></div>
  ${D.items.map(i => `<div class="pr s"><span class="n">${(i.name.split(' ')[0] + ' ' + (i.name.split(' ')[1] || '').slice(0, 4) + ' ' + i.pack.replace('₹10 pack', '10')).toUpperCase()}</span><span>${i.qty}</span><span>${i.mrp}</span><span>${i.rate.toFixed(2)}</span><span>${i.amount.toFixed(2)}</span></div>`).join('')}
  <div class="dash"></div>
  <div class="pr b"><span>NET PAYABLE</span><span>${D.billTotal.toLocaleString('en-IN')}.00</span></div>
  <div class="qr"></div>
</div>`;

const screens = {
  home: page(`<div class="scroll">
    <div class="row" style="margin:14px 4px 0"><div class="sub">${D.shop.name} · ${D.shop.place}</div>${icon('bell')}</div>
    <h1>Namaste, ${D.shop.owner}</h1>
    <div class="card"><div class="sub">Today on your QR</div><div class="big">${inr(5180)}</div><div class="sub">63 payments so far</div></div>
    <div class="card" style="background:var(--navy);color:#fff">
      <div class="row"><div><div style="font-size:21px;font-weight:700;line-height:1.25">Pay a wholesaler bill</div><div style="opacity:.75;font-size:14px;margin-top:6px;line-height:1.4">Photograph it. We read the total<br>and every item on it.</div></div>
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center">${icon('camera')}</div></div>
    </div>
    <div class="card"><div class="row"><div class="sub">Munafa this week</div>${icon('chevron-right')}</div>
      <div class="big" style="font-size:32px">about ${inr(Math.round(D.weekProfit / 100) * 100)}</div>
      <div class="sub">From 14 bills you paid here. Coca-Cola earned the most.</div></div>
  </div><div class="fade"></div>${tabbar('home')}`),

  scan: page(`<div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 40%,#3a3530,#121110)"></div>
    <style>.paper{position:absolute;left:34px;top:150px;width:322px;background:#fbfaf6;color:#222;font-family:"Courier New",monospace;padding:16px 14px 14px;transform:rotate(-2.2deg);box-shadow:0 30px 60px rgba(0,0,0,.55);border-radius:3px}
    .pc{text-align:center;font-weight:700;font-size:13px}.s{font-size:9.5px;font-weight:400}.pc.s{font-weight:400}
    .pr{display:flex;justify-content:space-between;gap:4px;margin:3px 0}.pr span{flex:0 0 30px;text-align:right;white-space:nowrap}.pr span:last-child{flex-basis:52px}.pr span:nth-child(4){flex-basis:40px}.pr .n{flex:1;text-align:left}.b{font-weight:700}
    .pr.b{font-size:11px}.pr.b span{flex:none}
    .dash{border-top:1px dashed #999;margin:7px 0}.qr{width:54px;height:54px;margin:10px auto 0;background:repeating-conic-gradient(#222 0 25%,#fbfaf6 0 50%) 0 0/9px 9px;border:4px solid #fbfaf6;outline:1px solid #222}
    .corner{position:absolute;width:44px;height:44px;border:4px solid #fff;border-radius:4px}
    </style>${billPaper}
    <div class="corner" style="left:22px;top:132px;border-right:0;border-bottom:0;border-top-left-radius:18px"></div>
    <div class="corner" style="right:22px;top:132px;border-left:0;border-bottom:0;border-top-right-radius:18px"></div>
    <div class="corner" style="left:22px;top:482px;border-right:0;border-top:0;border-bottom-left-radius:18px"></div>
    <div class="corner" style="right:22px;top:482px;border-left:0;border-top:0;border-bottom-right-radius:18px"></div>
    <div class="lg lg-dark" style="position:absolute;left:20px;top:64px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:#fff">${icon('x')}</div>
    <div class="lg lg-dark" style="position:absolute;left:50%;top:66px;transform:translateX(-50%);height:40px;padding:0 16px;display:flex;align-items:center;gap:8px;color:#fff;font-weight:600;font-size:15px">${icon('sparkles')} Reading 8 items</div>
    <div style="position:absolute;left:0;right:0;bottom:56px;display:flex;align-items:center;justify-content:center;gap:56px;z-index:3">
      <div class="lg lg-dark" style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;color:#fff">${icon('image')}</div>
      <div style="width:78px;height:78px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center"><div style="width:62px;height:62px;border-radius:50%;background:#fff"></div></div>
      <div class="lg lg-dark" style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;color:#fff">${icon('zap')}</div>
    </div>`, { dark: true }),

  bill: page(`<div class="scroll">
    <div class="row" style="margin:10px 0 0"><div class="lg" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">${icon('chevron-left')}</div><span class="chip">${icon('badge-check')}GST e-invoice verified</span></div>
    <h1 style="font-size:28px;margin-top:16px">${D.wholesaler.name}</h1>
    <div class="lead">Bill ${D.wholesaler.invoice} · ${D.wholesaler.date}</div>
    <div class="card" style="padding:6px 20px">
      ${D.items.map((i, k) => `<div class="row" style="padding:12px 0;${k ? 'border-top:1px solid var(--line)' : ''}">
        <div><div style="font-weight:600;font-size:15px">${i.name}</div><div class="sub" style="font-size:13px">${i.qty} × ${inr(i.rate, i.rate % 1 ? 2 : 0)} · MRP ${inr(i.mrp)}</div></div>
        <div style="text-align:right"><div style="font-weight:600;font-size:15px">${inr(i.amount)}</div><div class="sub" style="font-size:13px">${i.marginPct.toFixed(0)}% yours</div></div></div>`).join('')}
    </div>
  </div><div class="fade"></div>
  <div class="lg bottom"><div class="row" style="padding:4px 12px 10px"><span class="sub">8 items · to ${D.wholesaler.name.split(' ').slice(0, 2).join(' ')}</span><span style="font-weight:700">${inr(D.billTotal)}</span></div><div class="btn">Pay ${inr(D.billTotal)}</div></div>`),

  paid: page(`<div class="scroll" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:110px">
    <div style="width:96px;height:96px;border-radius:50%;background:var(--ok);display:flex;align-items:center;justify-content:center;color:#fff">${icon('check', 'xl')}</div>
    <div class="big" style="margin-top:26px">${inr(D.billTotal)}</div>
    <div style="font-size:19px;font-weight:600;margin-top:6px">Paid to ${D.wholesaler.name}</div>
    <div class="sub" style="margin-top:6px">UPI · 21 Oct, 7:42 pm · Bill saved</div>
    <div class="card" style="width:100%;text-align:left;margin-top:36px">
      <div class="row"><div style="font-weight:600">8 items added to your stock</div>${icon('package-check')}</div>
      <div class="hr"></div>
      <div class="sub">Your Munafa updates tonight. Surf Excel is new this month, so we'll learn how fast it sells.</div>
    </div>
  </div><div class="lg bottom" style="padding:8px"><div class="btn light" style="background:transparent">Done</div></div>
  <style>.ic.xl{width:52px;height:52px}</style>`),

  munafa: page(`<div class="scroll">
    <h1>Munafa</h1>
    <div class="lead">Last 30 days, from 14 bills and 3 wholesalers</div>
    <div class="card"><div class="sub">You earned about</div><div class="big">${inr(D.monthProfit)}</div><div class="sub">on ${inr(D.monthBuying)} of stock · ${D.blendedMargin}% on average</div></div>
    <div class="card">
      <div style="font-weight:700;font-size:17px">Earned per week</div>
      <div class="sub" style="margin-bottom:12px">Margin on each item, times how fast it sells</div>
      ${top3.slice(0, 6).map(i => {
        const w = Math.round(i.perWeek / top3[0].perWeek * 100);
        const hot = i === coke || i === surf;
        return `<div style="margin:10px 0 0">
          <div class="row" style="font-size:14px"><span style="font-weight:600">${i.name}</span><span style="font-weight:600">${inr(Math.round(i.perWeek))}</span></div>
          <div style="height:10px;border-radius:6px;background:#f0f0f2;margin-top:5px"><div style="height:10px;border-radius:6px;width:${w}%;background:${hot ? 'var(--sky)' : 'var(--navy)'}"></div></div>
          <div class="sub" style="font-size:12px;margin-top:3px">${i.marginPct.toFixed(0)}% margin · sells in ${i.days} days</div></div>`;
      }).join('')}
    </div>
  </div><div class="fade"></div>${tabbar('munafa')}`),

  insight: page(`<div class="scroll">
    <h1>Munafa</h1>
    <div class="lead">Two items, nearly the same margin</div>
    ${[coke, surf].map(i => `<div class="card">
      <div class="row"><div><div style="font-weight:700;font-size:18px">${i.name}</div><div class="sub">${i.pack} · ${i.marginPct.toFixed(0)}% margin</div></div><div style="text-align:right"><div class="big" style="font-size:30px">${inr(Math.round(i.perWeek))}</div><div class="sub">a week</div></div></div>
      <div class="hr"></div>
      <div class="sub">A bill of ${i.qty} sells in <b style="color:var(--ink)">${i.days} days</b>.</div>
      <div style="display:flex;gap:3px;margin-top:10px">${Array.from({ length: 28 }, (_, d) => `<div style="flex:1;height:22px;border-radius:3px;background:${(d % i.days) === 0 ? 'var(--navy)' : '#eef0f3'}"></div>`).join('')}</div>
      <div class="sub" style="font-size:12px;margin-top:6px">Each dark day is a fresh bill in 4 weeks</div>
    </div>`).join('')}
    <div class="card" style="background:#eaf8fe"><div style="font-weight:600;line-height:1.45">Coca-Cola earns you 4 times more each week. Next time, order 10 Surf Excel instead of 20 and keep ${inr(surf.rate * 10)} free.</div></div>
  </div><div class="fade"></div>${tabbar('munafa')}`),

  shelves: page(`<div class="scroll">
    <h1>On your shelves</h1>
    <div class="lead">Money you have paid wholesalers for stock that hasn't sold yet</div>
    <div class="card"><div class="big">${inr(D.onShelfTotal)}</div><div class="sub">Your stock sells in about ${D.stockDays} days, on average</div></div>
    <div class="card"><div style="font-weight:700;font-size:17px;margin-bottom:6px">Sitting the longest</div>
      ${[...D.slowOthers, { name: surf.name, pack: surf.pack, onShelf: surf.onShelf, days: surf.days }, { name: 'Tata Salt', pack: '1 kg', onShelf: 510, days: 10 }].map((i, k) => `<div class="row" style="padding:12px 0;${k ? 'border-top:1px solid var(--line)' : ''}">
        <div><div style="font-weight:600">${i.name}</div><div class="sub" style="font-size:13px">${i.pack} · ${inr(i.onShelf)} on the shelf</div></div>
        <div style="text-align:right;font-weight:700">${i.days} days</div></div>`).join('')}
    </div>
  </div><div class="fade"></div>${tabbar('munafa')}`),

  voice: page(`<div class="scroll" style="filter:blur(0)">
    <h1>Munafa</h1><div class="lead">Last 30 days, from 14 bills and 3 wholesalers</div>
    <div class="card"><div class="sub">You earned about</div><div class="big">${inr(D.monthProfit)}</div></div>
  </div>
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.25);z-index:8"></div>
  <div class="lg" style="position:absolute;left:10px;right:10px;bottom:10px;border-radius:40px;padding:22px 22px 28px;z-index:9;--lg-tint:rgba(255,255,255,.82)">
    <div style="width:40px;height:5px;border-radius:3px;background:rgba(0,0,0,.18);margin:-8px auto 16px"></div>
    <div class="row"><div><div style="font-weight:700;font-size:18px">Tonight's note</div><div class="sub">Hindi · 0:24</div></div>
      <div style="width:56px;height:56px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center">${icon('play')}</div></div>
    <div style="display:flex;align-items:center;gap:3px;height:44px;margin:16px 0">${Array.from({ length: 52 }, (_, k) => `<div style="flex:1;border-radius:2px;background:${k < 19 ? 'var(--navy)' : '#c9ccd3'};height:${8 + Math.round(30 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * .45)))}px"></div>`).join('')}</div>
    <div class="deva" style="font-size:17px;line-height:1.65">शर्मा जी, इस हफ़्ते आपने लगभग ₹8,900 कमाए। सबसे ज़्यादा कमाई कोका-कोला और फॉर्च्यून तेल से हुई। सर्फ़ एक्सेल पर मार्जिन अच्छा है, पर वह 24 दिन शेल्फ़ पर पड़ा रहता है। अगली बार 20 की जगह 10 मँगाइए।</div>
  </div>`),

  credit: page(`<div class="scroll">
    <div class="row" style="margin:10px 0 0"><div class="lg" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">${icon('chevron-left')}</div></div>
    <h1 style="font-size:30px;line-height:1.15">Pay Balaji's next bill today, from your sales</h1>
    <div class="lead" style="margin-top:8px">Paytm pays the wholesaler now. You repay a little each day from your QR.</div>
    <div class="card"><div class="row"><div><div class="sub">Up to</div><div class="big">${inr(D.credit.amount)}</div></div>
      <div style="text-align:right"><div class="sub">Repay</div><div style="font-size:24px;font-weight:800">${inr(D.credit.perDay)}<span class="sub" style="font-weight:500"> /day</span></div></div></div>
      <div class="hr"></div>
      <div class="row sub"><span>For ${D.credit.days} days · fee ${inr(D.credit.fee)}</span><span>${D.credit.shareOfQr}% of your daily QR</span></div></div>
    <div class="card"><div style="font-weight:700;margin-bottom:10px">Why you got this</div>
      <div class="sub" style="line-height:1.6">Your stock sells in ${D.stockDays} days.<br>You paid 14 wholesaler bills here on time.<br>Your QR brings in about ${inr(D.qrPerDay)} a day.</div></div>
    <div class="sub" style="font-size:12px;margin:0 6px">Example terms for the demo. A lending partner sets the real ones.</div>
  </div><div class="fade"></div>
  <div class="lg bottom"><div class="btn">Pay ${inr(D.credit.amount)} to Balaji now</div></div>`),

  request: page(`<div class="scroll">
    <h1>Bills</h1><div class="lead">Wholesalers on Paytm send their bills here</div>
    <div class="card" style="border:2px solid var(--sky)">
      <div class="row"><div style="font-weight:700;font-size:17px">${D.wholesaler.name}</div><span class="sub">2 min ago</span></div>
      <div class="sub" style="margin-top:4px">Sent today's bill from their billing software</div>
      <div class="hr"></div>
      <div class="row"><span class="sub">8 items · ${D.wholesaler.invoice}</span><span style="font-weight:800;font-size:22px">${inr(D.billTotal)}</span></div>
      <div style="display:flex;gap:10px;margin-top:16px"><div class="btn" style="flex:1;height:48px;font-size:16px">Pay now</div><div class="btn light" style="flex:1;height:48px;font-size:16px;border:1px solid var(--line)">Pay from sales</div></div>
    </div>
    <div class="card"><div class="row"><div><div style="font-weight:600">Gupta Dairy Supply</div><div class="sub">Paid 19 Oct · 3 items</div></div><div style="font-weight:600">${inr(4260)}</div></div>
      <div class="hr"></div><div class="row"><div><div style="font-weight:600">Shree Balaji Traders</div><div class="sub">Paid 15 Oct · 11 items</div></div><div style="font-weight:600">${inr(17830)}</div></div>
      <div class="hr"></div><div class="row"><div><div style="font-weight:600">Noida Cold Drinks Agency</div><div class="sub">Photo · paid 14 Oct · 4 items</div></div><div style="font-weight:600">${inr(6120)}</div></div></div>
  </div><div class="fade"></div>${tabbar('bills')}`),
};

fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const pg = await browser.newPage();
await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
const only = process.argv[2];
for (const [name, html] of Object.entries(screens)) {
  if (only && only !== name) continue;
  const file = path.join(here, 'screens', name + '.html');
  fs.writeFileSync(file, html);
  await pg.goto('file://' + file, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(here, 'shots', name + '.png'), omitBackground: true });
  console.log('shot', name);
}
await browser.close();
