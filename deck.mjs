// node deck.mjs -> deck.html + Munafa-deck.pdf (numbers from data.mjs, screens from shots/)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import puppeteer from 'puppeteer';
import * as D from './data.mjs';

const { inr } = D;
const here = path.dirname(new URL(import.meta.url).pathname);
const coke = D.items.find(i => i.name.startsWith('Coca'));
const surf = D.items.find(i => i.name.startsWith('Surf'));

// smaller copies of the screens for the deck, so the PDF stays under 2 MB
const NUM = { home: 1, scan: 2, bill: 3, paid: 4, munafa: 5, insight: 6, shelves: 7, voice: 8, credit: 9, request: 10 };
fs.mkdirSync(path.join(here, 'shots2/sm'), { recursive: true });
for (const n of Object.values(NUM)) await sharp(path.join(here, 'shots2', n + '.png')).resize({ height: 1100 }).png({ palette: true, quality: 90, effort: 10 }).toFile(path.join(here, 'shots2/sm', n + '.png'));
const ph = (n, cls = '') => `<img class="ph ${cls}" src="shots2/sm/${NUM[n]}.png" alt="">`;
const foot = n => `<div class="foot"><span>Munafa · Track 1, Merchant Growth AI</span><span>${n}</span></div>`;

const slides = [
  // 1
  `<section class="dark split">
    <div class="col">
      <img src="brand/paytm-app.svg" alt="Paytm" style="height:30px;display:block;margin-bottom:36px"><h1 class="hero">Munafa</h1>
      <p class="lede">Pay your wholesaler by photographing the bill. Find out what each item in your shop really earns.</p>
      <p class="meta">Paytm Build for India AI Hackathon, Delhi · Track 1: Merchant Growth AI<br>Akash Wadhwani · sheets.works</p>
    </div>${ph('home', 'tall')}</section>`,
  // 2
  `<section><h2>Problem: Paytm sees money coming in, not what it bought</h2>
    <div class="two">
      <div class="card"><h3>What Paytm sees about a kirana today</h3><div class="num">${inr(D.qrPerDay)} a day</div>
        <p class="mute">comes in by QR. That is all. The AI Soundbox can already tell the owner this total, in 11 languages.</p>
        <p class="src">Source: Paytm AI Soundbox launch, Global Fintech Fest, Oct 2025</p></div>
      <div class="card"><h3>What nobody sees</h3>
        <ul><li>What the shop buys, and from which wholesaler</li><li>What each item earns once you count how fast it sells</li><li>How much cash is sitting on the shelves</li><li>Wholesaler bills, mostly paid in cash or cheque, outside Paytm</li></ul>
        <p class="strong">The owner knows MRP minus rate on one packet. He does not know which items earn him the most each week.</p></div>
    </div>${foot(2)}</section>`,
  // 3
  `<section><h2>The wholesaler's bill already holds the item data</h2>
    <div class="pair">${ph('scan')}<div class="steps">
      <div class="step"><b>1</b><div><h3>Every bill lists item, quantity, the rate paid and the printed MRP.</h3><p class="mute">That is margin per item, already written down.</p></div></div>
      <div class="step"><b>2</b><div><h3>A kirana sells roughly what it buys.</h3><p class="mute">If 48 bottles of Coca-Cola come in every 4 days, about 48 go out every 4 days.</p></div></div>
      <div class="step"><b>3</b><div><h3>Owners won't photograph bills for a report. They will to pay.</h3><p class="mute">So the photo is the payment.</p></div></div>
    </div></div>${foot(3)}</section>`,
  // 4
  `<section><h2>Solution: photograph the bill, pay it, see the profit</h2>
    <div class="four">${[['scan', '1. Photograph the bill', 'AI reads all 8 lines'], ['bill', '2. Check it', 'Margin per item, GST QR checked'], ['paid', '3. Pay by UPI', 'Stock and bill saved'], ['munafa', '4. Munafa', 'What each item earns a week']]
      .map(([n, a, b]) => `<figure>${ph(n)}<figcaption><b>${a}</b><span>${b}</span></figcaption></figure>`).join('')}</div>${foot(4)}</section>`,
  // 5
  `<section><h2>Profit per item is margin times speed</h2>
    <div class="pair">${ph('munafa')}${ph('insight')}<div class="text">
      <h3>${coke.name} and Surf Excel earn almost the same margin, ${coke.marginPct.toFixed(0)}% and ${surf.marginPct.toFixed(0)}%.</h3>
      <p class="mute">Coca-Cola sells a bill of ${coke.qty} in ${coke.days} days. Surf Excel takes ${surf.days} days to sell ${surf.qty}. So Coca-Cola earns ${inr(Math.round(coke.perWeek))} a week and Surf Excel ${inr(Math.round(surf.perWeek))}.</p>
      <div class="card tint"><p class="strong">The app tells him: order 10 Surf Excel next time, not 20, and keep ${inr(surf.rate * 10)} in hand.</p></div>
      <p class="src">Sample shop and bill, made up for the demo.</p></div></div>${foot(5)}</section>`,
  // 6
  `<section><h2>Cash on the shelves, and a note in Hindi every night</h2>
    <div class="pair">${ph('shelves')}${ph('voice')}<div class="text">
      <div class="num">${inr(D.onShelfTotal)}</div>
      <p class="mute">is paid out to wholesalers and still on Sharma ji's shelves. The Horlicks has been there 38 days. Cutting slow stock is the cheapest working capital a shop can find.</p>
      <h3>A 24-second voice note in Hindi after closing</h3>
      <p class="mute">What he earned, which item did best, and one thing to change on the next order. The same voice idea as the Soundbox, now about stock and profit.</p></div></div>${foot(6)}</section>`,
  // 7
  `<section><h2>Stock on credit, against stock Paytm can now see</h2>
    <div class="pair">${ph('credit')}<div class="text wide">
      ${[['Stock turnover', `This shop sells its stock in about ${D.stockDays} days. A loan for stock is backed by stock that moves.`],
         ['A payment record', 'Fourteen wholesaler bills paid through Paytm, on time.'],
         ['Real bills', 'Bills from wholesalers above ₹5 crore turnover carry a GST e-invoice QR signed by the government. Paytm checks it, so a fake bill cannot raise credit.']]
        .map(([a, b]) => `<div class="card row"><h3 class="lab">${a}</h3><p>${b}</p></div>`).join('')}
      <p class="src">Example: Paytm pays the wholesaler ${inr(D.credit.amount)} today; the shop repays ${inr(D.credit.perDay)} a day from its QR for ${D.credit.days} days, ${D.credit.shareOfQr}% of its daily QR. Illustrative terms; a lending partner sets real ones. More than half of Paytm's merchant loan disbursals already go to repeat borrowers (Q4 FY26 release).</p>
    </div></div>${foot(7)}</section>`,
  // 8
  `<section><h2>What Paytm learns about one shop</h2>
    <div class="two lop">
      <div class="card"><h3>Today</h3><p class="k">Money in</p><p class="v">${inr(D.qrPerDay)} a day by QR</p></div>
      <div class="card"><h3 class="blue">After a month of Munafa</h3><div class="grid2">
        ${[['Money in', inr(D.qrPerDay) + ' a day by QR'], ['Money out', inr(D.monthBuying) + ' a month to 3 wholesalers'], ['Item mix', '54 items, with margin and speed for each'], ['Profit', `about ${inr(D.monthProfit)} a month, ${D.blendedMargin}% on average`], ['Stock', `${inr(D.onShelfTotal)} on shelves, sells in ${D.stockDays} days`], ['Suppliers', 'who they are, how often, how much']]
          .map(([a, b]) => `<div><p class="k">${a}</p><p class="v">${b}</p></div>`).join('')}</div></div>
    </div><p class="src">The shop shares this with Paytm by consent, under the DPDP Act. Brand-level data leaves only in anonymised totals.</p>${foot(8)}</section>`,
  // 9
  `<section><h2>Next: wholesalers send the bill themselves</h2>
    <div class="pair">${ph('request')}<div class="text wide">
      <p class="big">Most wholesalers bill from Tally, Marg or BUSY. A small connector on their side sends each bill straight to the shop's Paytm, items attached. The shop taps pay. No photo.</p>
      <div class="three">${[['For the wholesaler', 'Paid the same day instead of chasing cash. Becomes a Paytm merchant.'], ['For Paytm', 'One wholesaler brings every shop on his route. Clean item data, no reading errors.'], ['Works today', 'Tally exposes its data to other software. BUSY and Marg have no public API yet, so the photo covers them.']]
        .map(([a, b]) => `<div class="card"><h3 class="blue">${a}</h3><p>${b}</p></div>`).join('')}</div></div></div>${foot(9)}</section>`,
  // 10
  `<section><h2>Tech stack</h2><div class="grid2 stack">
    ${[['Capture', 'Camera in the Paytm for Business app; edge detection and de-skew on the phone'],
       ['Read the bill', 'A vision language model returns item, qty, rate, MRP and GSTIN as JSON. Claude for the demo; an open model such as Qwen2.5-VL on Paytm\'s own servers in production'],
       ['Match items', '"AMUL BUTT 100 G" mapped to one catalogue entry by brand, pack and HSN, using embeddings plus rules'],
       ['Check the bill', 'GST e-invoice QR signature verified, totals re-added, duplicate bills caught'],
       ['Munafa engine', 'Days between bills per item give the sales rate; margin × rate gives rupees a week; stock on hand is bought minus estimated sold'],
       ['Voice', 'The model writes the script from the numbers; Hindi text-to-speech from an Indian voice model (Sarvam or Bhashini)'],
       ['Pay and lend', 'UPI collect to the wholesaler; stock credit through Paytm\'s existing lending partners'],
       ['Store', 'Postgres per merchant, with a consent flag on every shared field']]
      .map(([a, b]) => `<div class="card row"><h3 class="lab">${a}</h3><p>${b}</p></div>`).join('')}</div>${foot(10)}</section>`,
  // 11
  `<section><h2>USP: the bill and the payment are one step</h2>
    <div class="table"><div class="th"><span></span><span>Others</span><span class="blue">Munafa</span></div>
    ${[['Bill-scanning apps', 'BUSY, myBillBook and others read bills to enter stock. That is extra work, and the data stays in the shop\'s app.', 'Reads the bill because the owner is paying it. No extra step, and the data is tied to real money.'],
       ['Paytm AI Soundbox', 'Answers questions about money coming in.', 'Covers money going out, item by item, so the answers are about profit, not just sales.'],
       ['Merchant loans today', 'Sized from QR collections.', 'Stock credit sized from stock turnover and checked bills, paid straight to the wholesaler.']]
      .map(([a, b, c]) => `<div class="card tr"><h3>${a}</h3><p class="mute">${b}</p><p class="strong">${c}</p></div>`).join('')}</div>${foot(11)}</section>`,
  // 12
  `<section><h2>Impact and benefits</h2><div class="three">
    ${[['The shopkeeper', ['Knows which items earn and which sit', 'Frees cash stuck in slow stock', 'Pays wholesalers in one tap, with a record', 'Gets stock on credit when he needs it']],
       ['Paytm', ['Supplier payments move onto Paytm', 'Item-level data on every active shop', 'A better signal for lending, and a new loan', 'Wholesalers join as merchants']],
       ['The wholesaler', ['Paid the same day, not in cash weeks later', 'Fewer bills chased by hand', 'Sees which shops reorder']]]
      .map(([a, l]) => `<div class="card tallc"><h3 class="blue">${a}</h3><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>${foot(12)}</section>`,
  // 13
  `<section><h2>Business model: free for the shop</h2><p class="big">Munafa costs the shopkeeper nothing. Paytm earns on what it unlocks:</p>
    <div class="grid2 fill">${[['Stock credit', 'Distribution income from lending partners, the way Paytm earns on merchant loans today, on a smaller and more frequent loan.'],
       ['Payments', 'Wholesaler payments move onto Paytm, and wholesalers sign up for the gateway and devices.'],
       ['AI Soundbox', 'Munafa answers become part of the Soundbox AI plan merchants already pay for.'],
       ['Brand insight', 'With consent, anonymised sell-through by area, sold to FMCG brands who pay for this kind of data today.']]
      .map(([a, b]) => `<div class="card"><h3 class="blue">${a}</h3><p>${b}</p></div>`).join('')}</div>${foot(13)}</section>`,
  // 14
  `<section class="dark split">
    <div class="col"><h2 class="w">What we will build on 31 October</h2>
      <ol><li>Photograph a real wholesaler bill from a Noida kirana, live</li><li>Read every line, check the totals, show margin per item</li><li>Pay it by UPI in test mode</li><li>Munafa after a month of bills, with the Hindi voice note</li><li>The stock-credit offer, and Paytm's view of the shop</li></ol>
      <p class="meta">Akash Wadhwani · sheets.works<br>Clickable demo: akashwadhwani35.github.io/munafa</p></div>${ph('bill', 'tall')}</section>`,
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block');
@page{size:1280px 720px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#1d1d1f;--sub:#6e6e73;--navy:#012a72;--sky:#00b8f5;--bg:#f5f5f7;--tint:#e6f6fd}
body{font-family:Inter,Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;background:#888}
section{position:relative;width:1280px;height:720px;background:var(--bg);padding:44px 56px 60px;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}
@media screen{section{margin:0 auto 24px}}
.dark{background:#fff;color:var(--ink)}
.split{flex-direction:row;align-items:center;justify-content:space-between;padding:56px 80px}
.col{max-width:640px}
.hero{font-size:88px;font-weight:600;letter-spacing:-.03em}
.lede{font-size:26px;line-height:1.4;margin-top:20px;font-weight:400;color:#3a3a3c}
.meta{font-size:16px;line-height:1.6;color:var(--sub);margin-top:56px}
h2{font-size:34px;font-weight:600;letter-spacing:-.02em;line-height:1.15;margin-bottom:28px}
h2.w{color:var(--ink)}
h3{font-size:22px;font-weight:600;line-height:1.3}
p{font-size:18px;line-height:1.5}
.mute{color:var(--sub)}
.strong{font-weight:500;color:var(--navy)}
.blue{color:var(--navy)}
.src{font-size:12px;color:var(--sub);margin-top:auto}
.num{font-size:64px;font-weight:600;letter-spacing:-.03em;color:var(--navy);margin:8px 0}
.big{font-size:22px;line-height:1.45;margin-bottom:22px}
.card{background:#fff;border-radius:24px;padding:24px 26px;display:flex;flex-direction:column;gap:10px}
.card.tint{background:var(--tint)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1}
.two.lop{grid-template-columns:1fr 1.7fr;flex:none}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px}
ul{padding-left:22px;display:flex;flex-direction:column;gap:14px;font-size:20px;line-height:1.4}
ol{padding-left:26px;display:flex;flex-direction:column;gap:14px;font-size:21px;line-height:1.35;margin-top:8px}
.ph{height:540px;width:auto;flex:none}
.ph.tall{height:640px}
.pair{display:flex;gap:28px;align-items:flex-start}
.text{display:flex;flex-direction:column;gap:16px;padding-top:8px;max-width:520px;height:560px}
.text.wide{max-width:none;flex:1}
.steps{display:flex;flex-direction:column;gap:36px;padding-top:30px;flex:1}
.step{display:flex;gap:20px;align-items:flex-start}
.step b{flex:none;font-weight:500;width:40px;height:40px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px}
.step h3{font-size:22px;margin-bottom:6px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;justify-items:center}
.four .ph{height:510px}
figcaption{text-align:center;margin-top:12px;display:flex;flex-direction:column;gap:2px}
figcaption b{font-size:17px;font-weight:500}figcaption span{font-size:13px;color:var(--sub)}
.card.row{flex-direction:row;align-items:flex-start;gap:20px;padding:20px 24px}
.lab{flex:none;width:170px;color:var(--navy)}
.stack{gap:14px 20px}.stack .card.row p{font-size:16.5px}
.stack .lab{width:150px;font-size:17px}
.k{font-size:15px;color:var(--sub)}.v{font-size:21px;font-weight:500;margin-bottom:10px}
.table{display:flex;flex-direction:column;gap:14px}
.th,.tr{display:grid;grid-template-columns:220px 1fr 1fr;gap:28px;align-items:start}
.th{padding:0 26px;font-size:14px;font-weight:600;color:var(--sub)}
.tr{flex-direction:row}
.tallc{min-height:470px}.tr p{font-size:18px}.tr{padding:28px 26px}.th{font-size:16px}.table{gap:18px}
.fill{flex:1;grid-auto-rows:1fr;margin-bottom:24px}.fill .card{justify-content:center;padding:28px 32px}.fill p{font-size:19px}.three .card p{font-size:18px}.lop .card{min-height:420px}.foot{position:absolute;left:56px;right:56px;bottom:22px;display:flex;justify-content:space-between;font-size:12px;color:var(--sub)}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1280"><title>Munafa deck</title><style>${css}</style></head><body>${slides.join('\n')}</body></html>`;
fs.writeFileSync(path.join(here, 'deck.html'), html);

const browser = await puppeteer.launch({ headless: true });
const pg = await browser.newPage();
await pg.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await pg.goto('file://' + path.join(here, 'deck.html'), { waitUntil: 'networkidle0' });
await pg.evaluate(() => document.fonts.ready);
// flag anything that spills out of its slide
const spills = await pg.evaluate(() => [...document.querySelectorAll('section')].flatMap((s, i) => {
  const r = s.getBoundingClientRect();
  return [...s.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.width && (b.bottom > r.bottom + 1 || b.right > r.right + 1); }).map(e => `slide ${i + 1}: ${e.tagName}.${e.className} ${e.textContent.slice(0, 40)}`);
}));
console.log(spills.length ? spills.join('\n') : 'no spills');
await pg.pdf({ path: path.join(here, 'Munafa-deck.pdf'), width: '1280px', height: '720px', printBackground: true });
// one PNG per slide, for checking
fs.mkdirSync(path.join(here, 'deck-png'), { recursive: true });
const secs = await pg.$$('section');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(here, 'deck-png', `s${String(i + 1).padStart(2, '0')}.png`) });
await browser.close();
console.log('pdf', (fs.statSync(path.join(here, 'Munafa-deck.pdf')).size / 1e6).toFixed(2), 'MB');
