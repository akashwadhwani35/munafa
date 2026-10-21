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
const NUM = { home: 1, scan: 2, bill: 3, sched: 4, ledger: 5, export: 6, munafa: 7, insight: 8, shelves: 9, voice: 10, credit: 11, request: 12, better: 13 };
fs.mkdirSync(path.join(here, 'shots2/sm'), { recursive: true });
for (const n of Object.values(NUM)) await sharp(path.join(here, 'shots2', n + '.png')).resize({ height: 1100 }).png({ palette: true, quality: 90, effort: 10 }).toFile(path.join(here, 'shots2/sm', n + '.png'));
const ph = (n, cls = '') => `<img class="ph ${cls}" src="shots2/sm/${NUM[n]}.png" alt="">`;
const foot = n => `<div class="foot"><span>Munafa · Track 1, Merchant Growth AI</span><span>${n}</span></div>`;

const slides = [
  // 1
  `<section class="dark split">
    <div class="col">
      <img src="brand/paytm-app.svg" alt="Paytm" style="height:30px;display:block;margin-bottom:36px">
      <h1 class="hero">Munafa</h1>
      <p class="lede">A kirana pays its wholesaler by taking a photo of the bill. Paytm reads every item, keeps the ledger, and shows the owner what each item really earns.</p>
      <p class="meta">Paytm Build for India AI Hackathon, Delhi · Track 1: Merchant Growth AI<br>Akash Wadhwani · sheets.works</p>
    </div>${ph('home', 'tall')}</section>`,
  // 2
  `<section><h2>Problem: Paytm sees money coming in, not what the shop buys</h2>
    <div class="two">
      <div class="card"><h3>What Paytm sees today</h3><div class="num">${inr(D.qrPerDay)} a day</div>
        <p class="mute">coming in on the QR. The AI Soundbox already tells the owner this number, in 11 languages.</p>
        <p class="src">Source: Paytm AI Soundbox launch, Global Fintech Fest, Oct 2025</p></div>
      <div class="card"><h3>What nobody sees</h3>
        <ul><li>What the shop buys, and from which wholesaler</li><li>What each item earns once you count how fast it sells</li><li>How much cash is sitting on the shelves</li><li>The wholesaler bills, mostly paid in cash or cheque</li></ul>
        <p class="strong">The owner knows his margin on one packet. He doesn't know which items make him the most money each week.</p></div>
    </div>${foot(2)}</section>`,
  // 3
  `<section><h2>The wholesaler's bill already has the item data</h2>
    <div class="pair">${ph('scan')}<div class="steps">
      <div class="step"><b>1</b><div><h3>Every bill lists the item, quantity, rate paid and MRP.</h3><p class="mute">The margin on each item is already written down.</p></div></div>
      <div class="step"><b>2</b><div><h3>A kirana sells about what it buys.</h3><p class="mute">If 48 bottles of Coca-Cola come in every 4 days, about 48 go out every 4 days.</p></div></div>
      <div class="step"><b>3</b><div><h3>Owners won't scan bills to get a report, but they will to pay.</h3><p class="mute">So in Munafa, scanning the bill is how you pay it.</p></div></div>
    </div></div>${foot(3)}</section>`,
  // 4
  `<section><h2>Solution: scan the bill, pay it on the due date, see the profit</h2>
    <div class="four">${[['scan', '1. Scan the bill', 'Every line is read'], ['bill', '2. Check it', 'Wholesaler found on Paytm'], ['sched', '3. Pay on the due date', 'Or pay now'], ['munafa', '4. Munafa', 'What each item earns']]
      .map(([n, a, b]) => `<figure>${ph(n)}<figcaption><b>${a}</b><span>${b}</span></figcaption></figure>`).join('')}</div>${foot(4)}</section>`,
  // 5
  `<section><h2>How the money reaches the wholesaler</h2>
    <div class="pair">${ph('bill')}<div class="text wide">
      ${[['Already on Paytm', 'Many wholesalers take payments on a Paytm QR. Paytm matches the GSTIN or phone number on the bill to that merchant and pays him there.'],
         ['Bank details on the bill', 'Many bills print an account number and IFSC, or a UPI QR. The app reads them and pays by UPI.'],
         ['Neither', 'The first time, the owner scans the salesman\'s QR. After that, every bill from that GSTIN goes to the same account.']]
        .map(([a, b]) => `<div class="card row"><h3 class="lab">${a}</h3><p>${b}</p></div>`).join('')}
      <p class="mute" style="font-size:17px">Before any payment, the name the bank has for the account is checked against the name on the bill. Wholesalers usually give about 7 days of credit, so the owner can pay on the due date and Paytm reminds him the day before.</p>
    </div></div>${foot(5)}</section>`,
  // 6
  `<section><h2>Every bill lands in a ledger the CA can use</h2>
    <div class="pair">${ph('ledger')}${ph('export')}<div class="text">
      <h3>All bills, dues and payments by wholesaler, in the Paytm app.</h3>
      <p class="mute">At month end the owner sends it to his CA in one tap: Tally XML, Excel, PDF of every bill, or WhatsApp.</p>
      <p class="mute">Shops registered for GST need these purchase bills to claim input tax credit, and today most of them sit in a drawer.</p>
    </div></div>${foot(6)}</section>`,
  // 7
  `<section><h2>Profit per item is margin times speed</h2>
    <div class="pair">${ph('munafa')}${ph('insight')}<div class="text">
      <h3>Coca-Cola and Surf Excel have about the same margin, ${coke.marginPct.toFixed(0)}% and ${surf.marginPct.toFixed(0)}%.</h3>
      <p class="mute">Coca-Cola sells a bill of ${coke.qty} in ${coke.days} days. Surf Excel takes ${surf.days} days to sell ${surf.qty}. Coca-Cola earns ${inr(Math.round(coke.perWeek))} a week and Surf Excel ${inr(Math.round(surf.perWeek))}.</p>
      <div class="card tint"><p class="strong">Order 10 Surf Excel next time, not 20, and ${inr(surf.rate * 10)} stays free.</p></div>
      <p class="src">Sample shop and bill, made up for the demo.</p></div></div>${foot(7)}</section>`,
  // 8
  `<section><h2>Cash on the shelves, and a note in Hindi every night</h2>
    <div class="pair">${ph('shelves')}${ph('voice')}<div class="text">
      <div class="num">${inr(D.onShelfTotal)}</div>
      <p class="mute">is paid to wholesalers and still sitting on Sharma ji's shelves. The Horlicks has been there 38 days.</p>
      <h3>15 seconds in Hindi after closing</h3>
      <p class="mute">What he earned, what sold best, and one thing to change on the next order.</p></div></div>${foot(8)}</section>`,
  // 9
  `<section><h2>Stock credit, against stock Paytm can now see</h2>
    <div class="pair">${ph('credit')}<div class="text wide">
      ${[['Stock turnover', `This shop sells its stock in about ${D.stockDays} days. A loan for stock is backed by stock that moves.`],
         ['Payment record', 'Fourteen wholesaler bills paid through Paytm, on time.'],
         ['Real bills', 'Bills from wholesalers above ₹5 crore turnover carry a GST e-invoice QR signed by the government. Paytm checks it, so a made-up bill can\'t raise credit.']]
        .map(([a, b]) => `<div class="card row"><h3 class="lab">${a}</h3><p>${b}</p></div>`).join('')}
      <p class="src">Example: Paytm pays the wholesaler ${inr(D.credit.amount)} today and the shop repays ${inr(D.credit.perDay)} a day from its QR for ${D.credit.days} days, ${D.credit.shareOfQr}% of its daily QR. The terms are only an example; a lending partner sets the real ones. More than half of Paytm's merchant loan disbursals already go to repeat borrowers (Q4 FY26 release).</p>
    </div></div>${foot(9)}</section>`,
  // 10
  `<section><h2>What Paytm learns about one shop</h2>
    <div class="two lop">
      <div class="card"><h3>Today</h3><p class="k">Money in</p><p class="v">${inr(D.qrPerDay)} a day by QR</p></div>
      <div class="card"><h3 class="blue">After a month of Munafa</h3><div class="grid2">
        ${[['Money in', inr(D.qrPerDay) + ' a day by QR'], ['Money out', inr(D.monthBuying) + ' a month to 3 wholesalers'], ['Item mix', '54 items, with margin and speed for each'], ['Profit', `about ${inr(D.monthProfit)} a month, ${D.blendedMargin}% on average`], ['Stock', `${inr(D.onShelfTotal)} on shelves, sells in ${D.stockDays} days`], ['Suppliers', 'who they are, how often, how much, when due']]
          .map(([a, b]) => `<div><p class="k">${a}</p><p class="v">${b}</p></div>`).join('')}</div></div>
    </div><p class="src">The shop shares this with Paytm by consent, under the DPDP Act. Brand-level data leaves only as anonymised totals.</p>${foot(10)}</section>`,
  // 11
  `<section><h2>Later: wholesalers send bills, and a better price for the same item</h2>
    <div class="pair">${ph('request')}${ph('better')}<div class="text">
      <h3>Wholesalers send the bill to Paytm</h3>
      <p class="mute">Most wholesalers bill from Tally, Marg or BUSY. A small connector on their side sends each bill to the shop's Paytm, with the items. Tally already lets other software read its data; BUSY and Marg have no public API yet.</p>
      <h3>Same item, cheaper</h3>
      <p class="mute">Munafa knows what each shop pays for each item. With IndiaMART, it can show sellers nearby quoting less for the same pack, and what that saves a month.</p></div></div>${foot(11)}</section>`,
  // 12
  `<section><h2>Tech stack</h2><div class="grid2 stack">
    ${[['Capture', 'Camera in the Paytm for Business app; edge detection and de-skew on the phone'],
       ['Read the bill', 'A vision language model returns item, qty, rate, MRP, GSTIN and bank details as JSON. Claude for the demo; an open model such as Qwen2.5-VL on Paytm\'s own servers in production'],
       ['Find the payee', 'GSTIN and phone matched to Paytm merchants; UPI name check before every first payment'],
       ['Check the bill', 'GST e-invoice QR signature verified, totals re-added, duplicate bills caught'],
       ['Ledger', 'Bills, dues and payments per wholesaler; export to Tally XML, Excel and PDF'],
       ['Munafa engine', 'Days between bills give the sales rate; margin × rate gives rupees a week; stock is bought minus sold'],
       ['Voice', 'The model writes the note from the numbers; Hindi text-to-speech from an Indian voice model (Sarvam or Bhashini)'],
       ['Pay and lend', 'UPI, with one-time mandates for due-date payments; stock credit through Paytm\'s lending partners']]
      .map(([a, b]) => `<div class="card row"><h3 class="lab">${a}</h3><p>${b}</p></div>`).join('')}</div>${foot(12)}</section>`,
  // 13
  `<section><h2>USP: scanning the bill is how you pay it</h2>
    <div class="table"><div class="th"><span></span><span>Others</span><span class="blue">Munafa</span></div>
    ${[['Billing apps', 'BUSY, myBillBook and others read bills to enter stock. It\'s extra work, and the data stays in the shop\'s app.', 'The owner scans the bill to pay it, so the data comes in with no extra step and is tied to real money.'],
       ['Paytm AI Soundbox', 'Answers questions about money coming in.', 'Covers money going out, item by item, so the answers are about profit.'],
       ['Merchant loans today', 'Sized from QR collections.', 'Stock credit sized from stock turnover and checked bills, paid straight to the wholesaler.']]
      .map(([a, b, c]) => `<div class="card tr"><h3>${a}</h3><p class="mute">${b}</p><p class="strong">${c}</p></div>`).join('')}</div>${foot(13)}</section>`,
  // 14
  `<section><h2>Impact and benefits</h2><div class="three">
    ${[['The shopkeeper', ['Sees which items earn and which sit', 'Frees cash stuck in slow stock', 'Pays on the due date, with a reminder', 'A ledger his CA can use', 'Stock on credit when he needs it']],
       ['Paytm', ['Wholesaler payments move onto Paytm', 'Item-level data on every active shop', 'A better signal for lending, and a new loan', 'Wholesalers join as merchants']],
       ['The wholesaler', ['Paid on the due date, not chased in cash', 'Fewer bills followed up by hand', 'Sees which shops reorder']]]
      .map(([a, l]) => `<div class="card tallc"><h3 class="blue">${a}</h3><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>${foot(14)}</section>`,
  // 15
  `<section><h2>Business model: free for the shop</h2><p class="big">Munafa costs the shopkeeper nothing. Paytm earns on what it opens up:</p>
    <div class="grid2 fill">${[['Stock credit', 'Distribution income from lending partners, the way Paytm earns on merchant loans today, on a smaller loan taken more often.'],
       ['Payments', 'Wholesaler payments move onto Paytm, and wholesalers sign up for the gateway and devices.'],
       ['Soundbox and IndiaMART', 'Munafa answers join the Soundbox AI plan. Leads sent to IndiaMART sellers can earn a referral fee.'],
       ['Brand insight', 'With consent, anonymised sell-through by area, for FMCG brands who pay for this kind of data today.']]
      .map(([a, b]) => `<div class="card"><h3 class="blue">${a}</h3><p>${b}</p></div>`).join('')}</div>${foot(15)}</section>`,
  // 16
  `<section class="dark split">
    <div class="col"><h2 class="w">What we will build on 31 October</h2>
      <ol><li>Scan a real wholesaler bill from a Noida kirana, live</li><li>Read every line, find the payee, show the margin on each item</li><li>Pay it now or on the due date, in UPI test mode</li><li>The ledger, sent to Tally and Excel in one tap</li><li>Munafa after a month of bills, with the Hindi note</li></ol>
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
