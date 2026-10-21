// node app.mjs -> index.html: the clickable prototype, every screen live HTML inside the iPhone 17 Pro frame.
// Numbers come from data.mjs. ?shot=N renders screen N alone on a transparent page, for the deck.
import fs from 'node:fs';
import path from 'node:path';
import * as D from './data.mjs';

const { inr } = D;
const here = path.dirname(new URL(import.meta.url).pathname);
const coke = D.items.find(i => i.name.startsWith('Coca'));
const surf = D.items.find(i => i.name.startsWith('Surf'));
const byWeek = [...D.items].sort((a, b) => b.perWeek - a.perWeek);

// line icons, drawn on a 24 grid
const I = {
  home: '<path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  munafa: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  img: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
};
const ic = (n, s = 22, c = 'currentColor') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const sb = (light = false) => `<div class="sb${light ? ' lt' : ''}"><span>9:41</span><i class="di"></i>
  <svg width="78" height="14" viewBox="0 0 78 14" aria-hidden="true"><g fill="currentColor"><rect x="0" y="9" width="3.2" height="4" rx="1"/><rect x="4.8" y="6.5" width="3.2" height="6.5" rx="1"/><rect x="9.6" y="4" width="3.2" height="9" rx="1"/><rect x="14.4" y="1" width="3.2" height="12" rx="1"/>
  <path d="M30.5 3.2c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 30.5 1.4 10.6 10.6 0 0 0 23 4.5l1.2 1.2a9 9 0 0 1 6.3-2.5zm0 3.6c1.4 0 2.7.5 3.7 1.4l1.2-1.2a7 7 0 0 0-9.8 0l1.2 1.2c1-.9 2.3-1.4 3.7-1.4zm0 3.5c-.6 0-1.1.2-1.5.6l1.5 1.5 1.5-1.5c-.4-.4-.9-.6-1.5-.6z"/>
  <rect x="46.5" y="1" width="25" height="12" rx="3.6" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="48.5" y="3" width="18" height="8" rx="2"/><rect x="73" y="5" width="1.6" height="4" rx=".8" fill-opacity=".45"/></g></svg></div>`;
const tab = on => `<nav class="tab">${[['home', 'Home'], ['scan', 'Scan bill'], ['munafa', 'Munafa']].map(([k, l]) => `<span class="${k === on ? 'on' : ''}">${ic(k, 24)}${l}</span>`).join('')}</nav>`;
const top = title => `<div class="nav"><span class="gl round">${ic('back', 20)}</span>${title ? `<span class="nt">${title}</span>` : ''}<span style="width:40px"></span></div>`;
const logo = `<div class="hd"><img src="brand/paytm-app.svg" alt="Paytm"><span class="av">SK</span></div>`;
const row = (a, as, b, bs, first) => `<div class="row li${first ? ' first' : ''}"><div><div class="m">${a}</div><div class="k s">${as}</div></div><div class="r"><div class="m">${b}</div>${bs ? `<div class="k s">${bs}</div>` : ''}</div></div>`;

const recent = `<div class="k lab">Bills paid here</div><div class="card list">
  ${row('Gupta Dairy Supply', '19 Oct · 3 items', inr(4260), '', true)}${row('Shree Balaji Traders', '15 Oct · 11 items', inr(17830))}${row('Noida Cold Drinks Agency', '14 Oct · 4 items', inr(6120))}</div>`;
const munafaCard = `<div class="card"><div class="row"><span class="k">Munafa this week</span>${ic('chev', 16, '#6e6e73')}</div>
  <div class="amt sm">${inr(Math.round(D.weekProfit / 100) * 100)}</div>
  <div class="spark">${[52, 64, 48, 71, 60, 83, 100].map((h, i) => `<i class="${i === 6 ? 'on' : ''}" style="height:${h}%"></i>`).join('')}</div></div>`;

const S = [];
const add = (line, body, cls = '') => S.push({ line, html: `<div class="app ${cls}">${body}</div>` });

// 1 home
add(`${D.shop.owner}'s wholesaler has just dropped off stock and a bill.`, `${sb()}${logo}<div class="body">
  <div class="k">${D.shop.name} · today on your QR</div><div class="amt">${inr(5180)}</div><div class="k">63 payments</div>
  <div class="card pay tap"><div class="row"><div><div class="t">Pay a wholesaler bill</div><div class="k">Take a photo of the bill</div></div><span class="cam">${ic('cam', 22, '#fff')}</span></div></div>
  ${munafaCard}${recent}</div>${tab('home')}`);

// 2 scan
add('He takes a photo. Every line on the bill is read.', `${sb(true)}<div class="cam-bg"><img src="bills/bill.png" alt="The wholesaler's bill"></div>
  <div class="frame"><i></i><i></i><i></i><i></i></div>
  <div class="scantop"><span class="gl dark round">${ic('close', 20)}</span><span class="gl dark chip">Reading 8 items</span><span style="width:40px"></span></div>
  <div class="shutter"><span class="gl dark round big">${ic('img', 22)}</span><span class="sh tap"><i></i></span><span class="gl dark round big">${ic('bolt', 22)}</span></div>`, 'dark');

// 3 bill read
add("Each item shows what he keeps. The bill's GST QR checks out.", `${sb()}${top('')}<div class="body tight">
  <div class="ok">${ic('check', 16, '#159a5c')}GST e-invoice verified</div>
  <h1>${D.wholesaler.name}</h1><div class="k">Bill ${D.wholesaler.invoice} · ${D.wholesaler.date}</div>
  <div class="card list">${D.items.map((i, k) => row(i.name, `${i.qty} × ${inr(i.rate, i.rate % 1 ? 2 : 0)} · MRP ${inr(i.mrp)}`, inr(i.amount), `you keep ${i.marginPct.toFixed(0)}%`, !k)).join('')}</div></div>
  <div class="gl bar"><div class="row bt"><span class="k">8 items</span><span class="m">${inr(D.billTotal)}</span></div><div class="btn tap">Pay ${inr(D.billTotal)}</div></div>`);

// 4 paid
add('He pays by UPI. The bill and its items are saved.', `${sb()}<div class="paid">
  <img class="plogo" src="brand/paytm-app.svg" alt="Paytm">
  <div class="to">${D.wholesaler.name}</div><div class="k">UPI ID: ******4821@okhdfcbank</div>
  <div class="big">${inr(D.billTotal)}<span class="badge">${ic('check', 22, '#fff')}</span></div>
  <div class="k">21 Oct, 7:42 PM · Ref. No: 218615822684</div></div>
  <div class="body"><div class="card"><div class="m">Bill saved with this payment</div><div class="k" style="margin-top:4px">${D.wholesaler.invoice} · 8 items added to your stock</div></div>
  <div class="card"><div class="m">Munafa updates tonight</div><div class="k" style="margin-top:4px">Surf Excel is new this month. We'll learn how fast it sells.</div></div></div>
  <div class="gl bar"><div class="btn ghost tap">Done</div></div>`);

// 5 munafa
add('After a month, what each item earns in a week.', `${sb()}<div class="body">
  <h1 class="lg">Munafa</h1><div class="k">Last 30 days · 14 bills · 3 wholesalers</div>
  <div class="card"><div class="k">You earned about</div><div class="amt">${inr(D.monthProfit)}</div><div class="k">on ${inr(D.monthBuying)} of stock, ${D.blendedMargin}% on average</div></div>
  <div class="card tap"><div class="m">Earned per week</div><div class="k">Margin on each item, times how fast it sells</div>
  ${byWeek.slice(0, 6).map(i => `<div class="bi"><div class="row"><span>${i.name}</span><span class="m">${inr(Math.round(i.perWeek))}</span></div>
    <div class="track"><i style="width:${Math.round(i.perWeek / byWeek[0].perWeek * 100)}%" class="${i === coke || i === surf ? 'hi' : ''}"></i></div>
    <div class="k s">${i.marginPct.toFixed(0)}% margin · sells in ${i.days} days</div></div>`).join('')}</div></div>${tab('munafa')}`);

// 6 coke vs surf
add('Same margin. Coca-Cola sells six times faster.', `${sb()}${top('Munafa')}<div class="body tight">
  ${[coke, surf].map(i => `<div class="card"><div class="row"><div><div class="m lgm">${i.name}</div><div class="k">${i.pack} · ${i.marginPct.toFixed(0)}% margin</div></div><div class="r"><div class="amt sm">${inr(Math.round(i.perWeek))}</div><div class="k">a week</div></div></div>
    <div class="k" style="margin-top:14px">A bill of ${i.qty} sells in ${i.days} days</div>
    <div class="days">${Array.from({ length: 28 }, (_, d) => `<i class="${d % i.days === 0 ? 'on' : ''}"></i>`).join('')}</div>
    <div class="k s">Each blue day is a new bill, over 4 weeks</div></div>`).join('')}
  <div class="card note tap">Coca-Cola earns you 4 times more each week. Next time, order 10 Surf Excel, not 20, and keep ${inr(surf.rate * 10)} in hand.</div></div>`);

// 7 shelves
add(`${inr(D.onShelfTotal)} of his money is sitting on the shelves.`, `${sb()}<div class="body">
  <h1 class="lg">On your shelves</h1><div class="k">Stock you've paid for that hasn't sold yet</div>
  <div class="card"><div class="amt">${inr(D.onShelfTotal)}</div><div class="k">Your stock sells in about ${D.stockDays} days</div></div>
  <div class="k lab">Sitting the longest</div><div class="card list tap">
  ${[...D.slowOthers, { name: surf.name, pack: surf.pack, onShelf: surf.onShelf, days: surf.days }, { name: 'Tata Salt', pack: '1 kg', onShelf: 510, days: 10 }].map((i, k) => row(i.name, `${i.pack} · ${inr(i.onShelf)} on the shelf`, `${i.days} days`, '', !k)).join('')}</div></div>${tab('munafa')}`);

// 8 voice note
add('Every night, 24 seconds in Hindi.', `${sb()}<div class="body"><h1 class="lg">Munafa</h1><div class="k">Last 30 days · 14 bills · 3 wholesalers</div>
  <div class="card"><div class="k">You earned about</div><div class="amt">${inr(D.monthProfit)}</div></div></div>
  <div class="scrim"></div><div class="gl sheet tap"><i class="grab"></i>
  <div class="row"><div><div class="m lgm">Tonight's note</div><div class="k">Hindi · 0:24</div></div><span class="playb">${ic('play', 22, '#fff')}</span></div>
  <div class="wave">${Array.from({ length: 48 }, (_, k) => `<i class="${k < 17 ? 'on' : ''}" style="height:${7 + Math.round(26 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * .45)))}px"></i>`).join('')}</div>
  <div class="hi-text">शर्मा जी, इस हफ़्ते आपने लगभग ₹8,900 कमाए। सबसे ज़्यादा कमाई कोका-कोला और फॉर्च्यून तेल से हुई। सर्फ़ एक्सेल पर मार्जिन अच्छा है, पर वह 24 दिन शेल्फ़ पर पड़ा रहता है। अगली बार 20 की जगह 10 मँगाइए।</div></div>`);

// 9 stock credit
add('Paytm can now see his stock move, so it can pay his next bill.', `${sb()}${top('')}<div class="body tight">
  <h1>Pay Balaji's next bill today</h1><div class="k">Paytm pays the wholesaler now. You repay a little each day from your QR.</div>
  <div class="card"><div class="row"><div><div class="k">Up to</div><div class="amt">${inr(D.credit.amount)}</div></div><div class="r"><div class="k">You repay</div><div class="amt sm">${inr(D.credit.perDay)}<span class="k"> a day</span></div></div></div>
    <div class="row li first" style="margin-top:10px"><span class="k">${D.credit.days} days · fee ${inr(D.credit.fee)}</span><span class="k">${D.credit.shareOfQr}% of your daily QR</span></div></div>
  <div class="k lab">Why you got this</div><div class="card list">
    ${row('Your stock sells in ' + D.stockDays + ' days', 'From 14 bills over 30 days', '', '', true)}${row('14 bills paid on time', 'All through Paytm', '', '')}${row('About ' + inr(D.qrPerDay) + ' a day on your QR', 'Last 30 days', '', '')}</div>
  <div class="k s" style="margin-top:12px">Example terms for this demo. A lending partner sets the real ones.</div></div>
  <div class="gl bar"><div class="btn tap">Pay ${inr(D.credit.amount)} to Balaji</div></div>`);

// 10 wholesaler sends the bill
add('Later, wholesalers send the bill straight to Paytm.', `${sb()}${logo}<div class="body">
  <div class="k">${D.shop.name} · today on your QR</div><div class="amt">${inr(6240)}</div><div class="k">71 payments</div>
  <div class="card req tap"><div class="row"><div class="m">New bill from ${D.wholesaler.name}</div><span class="k s">2 min ago</span></div>
    <div class="k" style="margin-top:2px">Sent from their billing software · 8 items</div>
    <div class="row" style="margin-top:14px"><span class="amt sm">${inr(D.billTotal)}</span><div class="pair"><span class="btn mini">Pay</span><span class="btn mini ghost">Pay from sales</span></div></div></div>
  ${munafaCard}${recent}</div>${tab('home')}`);

const css = `
:root{--navy:#012a72;--sky:#00b8f5;--ink:#1d1d1f;--sub:#6e6e73;--ok:#21c179;--line:#eef0f3}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f5f5f7;color:var(--ink);font-family:Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;min-height:100svh;display:flex;flex-direction:column;align-items:center;font-feature-settings:"tnum" 1}
.top{width:100%;max-width:1080px;display:flex;justify-content:space-between;padding:22px 28px;font-size:15px}
.top b{font-weight:600}.top a{color:var(--navy);text-decoration:none}
.stage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:4px 16px 32px}
.line{font-size:17px;color:var(--sub);text-align:center;max-width:36ch;line-height:1.45;min-height:2.9em}
.dots{display:flex;gap:6px}.dots i{width:6px;height:6px;border-radius:3px;background:#c7c7cc}.dots i.on{width:18px;background:var(--navy)}
.ph{--w:min(330px,calc((100svh - 250px) * .46),calc(100vw - 48px));width:var(--w);aspect-ratio:1206/2622;position:relative;border-radius:calc(var(--w)*.195);background:linear-gradient(160deg,#4a4a4e,#1e1e21 45%,#3a3a3e);padding:calc(var(--w)*.012);box-shadow:inset 0 0 0 calc(var(--w)*.004) rgba(255,255,255,.25),0 30px 60px rgba(0,0,0,.14);flex:none;cursor:pointer;border:0;display:block;font:inherit;color:inherit;text-align:left;-webkit-appearance:none;appearance:none}
.ph::before{content:"";position:absolute;inset:calc(var(--w)*.012);border-radius:calc(var(--w)*.185);background:#0b0b0d}
.ph .scr{position:absolute;inset:calc(var(--w)*.034);border-radius:calc(var(--w)*.165);overflow:hidden;background:#000}
.ph .b{position:absolute;background:#2a2a2d;border-radius:2px;width:calc(var(--w)*.012)}
.ph .b.l1{left:calc(var(--w)*-.012);top:18%;height:5%}.ph .b.l2{left:calc(var(--w)*-.012);top:26%;height:9%}.ph .b.l3{left:calc(var(--w)*-.012);top:37%;height:9%}.ph .b.r1{right:calc(var(--w)*-.012);top:30%;height:14%}
.ph:focus-visible{outline:2px solid var(--navy);outline-offset:6px}
.view{position:absolute;left:0;top:0;width:402px;transform-origin:0 0}
.app{position:absolute;inset:0;display:none;background:linear-gradient(#e4edf7,#f2f4f7 300px);font-size:15px;text-align:left;overflow:hidden}
.app.on{display:block}
.app.dark{background:#111}
.sb{height:54px;display:flex;align-items:center;justify-content:space-between;padding:4px 32px 0 42px;font-weight:600;font-size:17px;color:#000;position:relative;z-index:6}
.sb.lt{color:#fff}
.di{position:absolute;left:50%;top:11px;width:126px;height:37px;border-radius:19px;background:#000;transform:translateX(-50%)}
.hd{display:flex;align-items:center;justify-content:space-between;padding:10px 22px 0}
.hd img{height:22px}
.av{width:36px;height:36px;border-radius:50%;background:#fff;display:grid;place-items:center;font-weight:600;color:var(--navy);font-size:14px}
.body{padding:24px 22px 140px}.body.tight{padding-top:8px}
.k{font-size:14px;color:var(--sub);line-height:1.4}.k.s{font-size:13px}
.m{font-weight:500}.lgm{font-size:17px}
.lab{margin:24px 0 8px}
h1{font-size:26px;font-weight:600;letter-spacing:-.01em;line-height:1.2;margin:6px 0 4px}
h1.lg{font-size:32px;margin:12px 0 4px}
.amt{font-size:40px;font-weight:600;letter-spacing:-.02em;margin:4px 0 2px;line-height:1.1}
.amt.sm{font-size:26px}
.card{background:#fff;border-radius:22px;padding:18px 20px;margin-top:14px}
.card.list{padding:2px 20px}
.row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.r{text-align:right}
.li{padding:13px 0;border-top:1px solid var(--line)}.li.first{border-top:0}
.pay .t{font-size:17px;font-weight:600;margin-bottom:2px}
.cam{width:48px;height:48px;border-radius:50%;background:var(--navy);display:grid;place-items:center;flex:none}
.spark{display:flex;align-items:flex-end;gap:5px;height:44px;margin-top:14px}
.spark i{flex:1;background:#d8e6f6;border-radius:3px}.spark i.on{background:var(--sky)}
.tab{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);display:flex;gap:4px;padding:6px;border-radius:999px;z-index:5;
  background:rgba(1,42,114,.86);-webkit-backdrop-filter:blur(18px) saturate(160%);backdrop-filter:blur(18px) saturate(160%);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 10px 30px rgba(1,42,114,.28)}
.tab span{display:flex;flex-direction:column;align-items:center;gap:3px;width:84px;padding:8px 0 6px;color:rgba(255,255,255,.75);font-size:12px;border-radius:999px}
.tab span.on{background:rgba(255,255,255,.16);color:#fff}
.gl{background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(20px) saturate(180%);backdrop-filter:blur(20px) saturate(180%);box-shadow:inset 0 1px 0 rgba(255,255,255,.8),inset 0 0 0 .5px rgba(255,255,255,.4),0 1px 2px rgba(0,0,0,.06),0 10px 30px rgba(0,0,0,.08)}
.gl.dark{background:rgba(40,40,44,.42);color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 0 0 .5px rgba(255,255,255,.15)}
.round{width:40px;height:40px;border-radius:50%;display:grid;place-items:center}.round.big{width:52px;height:52px}
.nav{display:flex;align-items:center;justify-content:space-between;padding:6px 18px 0}
.nt{font-weight:600;font-size:17px}
.ok{display:inline-flex;align-items:center;gap:6px;color:#159a5c;font-size:13px;font-weight:500;margin-top:10px}
.bar{position:absolute;left:14px;right:14px;bottom:26px;border-radius:32px;padding:10px;z-index:5}
.bt{padding:4px 12px 10px}
.btn{height:52px;border-radius:999px;background:var(--navy);color:#fff;font-weight:600;font-size:17px;display:grid;place-items:center}
.btn.ghost{background:transparent;color:var(--navy)}
.btn.mini{height:38px;padding:0 14px;font-size:14px;display:inline-grid;white-space:nowrap}
.btn.mini.ghost{background:#eef4fb}
.pair{display:flex;gap:8px}
.req{box-shadow:0 0 0 2px var(--sky)}
.cam-bg{position:absolute;inset:0;background:radial-gradient(120% 70% at 40% 25%,#7d8084,#4d5054 55%,#2e3033)}.cam-bg img{position:absolute;left:-22px;top:92px;width:446px;height:auto}
.frame{position:absolute;left:14px;right:14px;top:112px;height:400px;pointer-events:none}
.frame i{position:absolute;width:40px;height:40px;border:3px solid #fff}
.frame i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0;border-top-left-radius:16px}
.frame i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0;border-top-right-radius:16px}
.frame i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0;border-bottom-left-radius:16px}
.frame i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0;border-bottom-right-radius:16px}
.scantop{position:absolute;left:18px;right:18px;top:58px;display:flex;align-items:center;justify-content:space-between;z-index:4}
.chip{height:36px;padding:0 16px;border-radius:999px;display:flex;align-items:center;font-weight:500;font-size:14px}
.shutter{position:absolute;left:0;right:0;bottom:44px;display:flex;align-items:center;justify-content:center;gap:52px;z-index:4}
.sh{width:76px;height:76px;border-radius:50%;border:4px solid #fff;display:grid;place-items:center}.sh i{width:60px;height:60px;border-radius:50%;background:#fff}
.paid{text-align:center;padding:18px 22px 0;background:linear-gradient(#e4edf7,#eef3f9)}
.plogo{height:24px;margin:2px auto 22px;display:block}
.to{font-size:21px;font-weight:600}
.big{font-size:52px;font-weight:600;letter-spacing:-.02em;margin:22px 0 14px;display:inline-flex;align-items:center;gap:12px}
.badge{width:38px;height:38px;border-radius:50%;background:var(--ok);display:grid;place-items:center}
.paid .k{padding-bottom:22px}
.bi{margin-top:14px}.bi .row{font-size:15px}
.track{height:8px;border-radius:4px;background:#eef1f5;margin:6px 0 4px}.track i{display:block;height:8px;border-radius:4px;background:var(--navy)}.track i.hi{background:var(--sky)}
.days{display:flex;gap:3px;margin:8px 0 6px}.days i{flex:1;height:20px;border-radius:3px;background:#eef1f5}.days i.on{background:var(--sky)}
.note{background:#e6f6fd;font-weight:500;line-height:1.5;color:#0b2f6b}
.scrim{position:absolute;inset:0;background:rgba(0,0,0,.22);z-index:4}
.sheet{position:absolute;left:8px;right:8px;bottom:8px;border-radius:44px;padding:16px 24px 34px;z-index:5;background:rgba(255,255,255,.86)}
.grab{display:block;width:38px;height:5px;border-radius:3px;background:rgba(0,0,0,.18);margin:0 auto 16px}
.playb{width:54px;height:54px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center}
.wave{display:flex;align-items:center;gap:3px;height:40px;margin:18px 0}.wave i{flex:1;border-radius:2px;background:#c9ccd3}.wave i.on{background:var(--navy)}
.hi-text{font-family:"Noto Sans Devanagari",Inter,sans-serif;font-size:17px;line-height:1.7}
body.shot{background:transparent;display:block;min-height:0}
body.shot .top,body.shot .line,body.shot .dots{display:none}
body.shot .stage{padding:0;display:block}
body.shot .ph{--w:340px;box-shadow:inset 0 0 0 1.4px rgba(255,255,255,.25)}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Munafa, a clickable prototype</title>
<meta name="description" content="Pay your wholesaler by photographing the bill, and see what each item in your shop earns. Paytm Build for India AI Hackathon, Track 1.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500&display=block" rel="stylesheet">
<style>${css}</style></head>
<body>
<div class="top"><b>Munafa</b><a href="Munafa-deck.pdf">Deck</a></div>
<div class="stage">
  <button class="ph" id="ph" aria-label="Next screen"><i class="b l1"></i><i class="b l2"></i><i class="b l3"></i><i class="b r1"></i><span class="scr" id="scr"><span class="view" id="view">
${S.map(s => s.html).join('\n')}
  </span></span></button>
  <p class="line" id="line" aria-live="polite"></p>
  <div class="dots" id="dots"></div>
</div>
<script>
const LINES=${JSON.stringify(S.map(s => s.line))};
const scr=document.getElementById('scr'),view=document.getElementById('view'),apps=[...view.children],dots=document.getElementById('dots');
const q=new URLSearchParams(location.search);if(q.has('shot'))document.body.classList.add('shot');
LINES.forEach(()=>dots.appendChild(document.createElement('i')));
const fit=()=>{const s=scr.clientWidth/402;view.style.transform='scale('+s+')';view.style.height=scr.clientHeight/s+'px'};
let k=0;
function show(i){k=(i+LINES.length)%LINES.length;apps.forEach((a,j)=>a.classList.toggle('on',j===k));
  [...dots.children].forEach((d,j)=>d.classList.toggle('on',j===k));document.getElementById('line').textContent=LINES[k];
  if(!q.has('shot'))try{history.replaceState(null,'','#'+(k+1))}catch(e){}}
document.getElementById('ph').onclick=()=>show(k+1);
addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(k+1);if(e.key==='ArrowLeft')show(k-1)});
addEventListener('resize',fit);fit();
show((parseInt(q.get('shot')||location.hash.slice(1))||1)-1);
</script>
</body></html>`;
fs.writeFileSync(path.join(here, 'index.html'), html);
console.log('index.html', S.length, 'screens');
