// node bill.mjs -> bills/bill.png, a stand-in photo of the wholesaler's bill.
// Replace bills/bill.png with a real photo (and data.mjs with its lines) when we have one.
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import * as D from './data.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const hsn = { Fortune: '1512', Coca: '2202', Aashirvaad: '1101', Maggi: '1902', Parle: '1905', Surf: '3402', Amul: '0405', Tata: '2501' };
const words = n => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const t = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = x => x < 20 ? a[x] : t[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : '');
  const th = Math.floor(n / 1000), h = Math.floor(n % 1000 / 100), r = n % 100;
  return [th && two(th) + ' Thousand', h && a[h] + ' Hundred', r && two(r)].filter(Boolean).join(' ');
};
const qr = await QRCode.toDataURL(`SBT/2610/0418|09AAFCS4821K1Z3|${D.billTotal}|21/10/2026`, { margin: 0, width: 220 });

const rows = D.items.map((i, k) => `<tr><td>${k + 1}</td><td class="l">${(i.name + ' ' + i.pack).toUpperCase()}</td><td>${hsn[i.name.split(/[ -]/)[0]] || ''}</td><td>${i.qty}</td><td>${i.mrp.toFixed(2)}</td><td>${i.rate.toFixed(2)}</td><td>${i.amount.toFixed(2)}</td></tr>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1400px;height:1300px;background:transparent;overflow:hidden;font-family:"Courier New",Courier,monospace}
.light{position:absolute;inset:0;background:radial-gradient(70% 55% at 35% 25%,rgba(255,250,235,.35),rgba(0,0,0,0) 60%),linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.25));pointer-events:none;z-index:3}
.paper{position:absolute;left:160px;top:120px;width:1080px;padding:44px 46px 38px;background:linear-gradient(176deg,#fbfaf5,#f1efe6 70%,#e9e6dc);color:#26272b;
  transform:perspective(2400px) rotateX(9deg) rotateZ(-2.4deg);transform-origin:50% 0;box-shadow:0 40px 80px rgba(0,0,0,.45),0 6px 14px rgba(0,0,0,.3)}
.paper::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.018) 0 2px,rgba(0,0,0,0) 2px 5px);pointer-events:none}
.fold{position:absolute;left:0;right:0;top:46%;height:2px;background:linear-gradient(90deg,rgba(0,0,0,.05),rgba(0,0,0,.12),rgba(0,0,0,.04))}
.box{border:2px solid #333}
.c{text-align:center}.b{font-weight:700}
.hd{display:grid;grid-template-columns:1.3fr 1fr;border-bottom:2px solid #333}
.hd>div{padding:12px 16px;font-size:19px;line-height:1.45}.hd>div+div{border-left:2px solid #333}
.name{font-size:30px;font-weight:700;letter-spacing:.04em}
table{width:100%;border-collapse:collapse;font-size:19px}
th,td{border-right:1px solid #555;padding:6px 10px;text-align:right}
th{border-bottom:2px solid #333;font-weight:700}
td.l,th.l{text-align:left}
th:last-child,td:last-child{border-right:0}
tbody tr td{padding-top:7px;padding-bottom:7px}
.ft{display:grid;grid-template-columns:1fr 330px;border-top:2px solid #333;font-size:19px}
.ft>div{padding:12px 16px;line-height:1.5}.ft>div+div{border-left:2px solid #333}
.qr{display:flex;gap:18px;align-items:center;padding:12px 16px;border-top:2px solid #333;font-size:16px;line-height:1.5}
.qr img{width:150px;height:150px;image-rendering:pixelated}
.stamp{position:absolute;right:110px;bottom:70px;width:200px;height:200px;border:4px solid rgba(40,70,160,.55);border-radius:50%;color:rgba(40,70,160,.6);font:700 20px Arial;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-14deg)}
.pen{position:absolute;left:640px;bottom:120px;font:italic 40px "Snell Roundhand","Brush Script MT",cursive;color:rgba(20,40,120,.75);transform:rotate(-6deg)}
</style></head><body><div class="paper"><div class="fold"></div>
<div class="c b" style="font-size:22px;margin-bottom:8px;letter-spacing:.2em">TAX INVOICE</div>
<div class="box">
  <div class="hd"><div><div class="name">${D.wholesaler.name.toUpperCase()}</div>Shop 14, Phase 2 Market, Sector 63, Noida 201301<br>Ph 98110 4x4x7 · GSTIN ${D.wholesaler.gstin}</div>
    <div>Inv No : <b>${D.wholesaler.invoice}</b><br>Date &nbsp;&nbsp;: 21/10/2026<br>Route : SEC-62 &nbsp; Salesman : RAJU<br>Party : <b>SHARMA KIRANA STORE</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sector 62, Noida</div></div>
  <table><thead><tr><th>Sn</th><th class="l">Product</th><th>HSN</th><th>Qty</th><th>MRP</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}
  <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
  <div class="ft"><div>Rs. ${words(D.billTotal)} Only<br><span style="font-size:16px">Rates incl. GST. Goods once sold will not be taken back. E.&amp;O.E.</span></div>
    <div>Gross &nbsp;&nbsp;&nbsp;&nbsp;: ${D.items.reduce((s, i) => s + i.amount, 0).toFixed(2)}<br>Round off : ${(D.billTotal - D.items.reduce((s, i) => s + i.amount, 0)).toFixed(2)}<br><b style="font-size:24px">NET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${D.billTotal.toLocaleString('en-IN')}.00</b></div></div>
  <div class="qr"><img src="${qr}" alt=""><div>e-Invoice<br>IRN : 7f3a91c2e0b84d6a9f5e21c7b3d08a4e<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 6c19f2a7d5e3b0c8a1f4e7d2b9c6a3f0<br>Ack No : 132619847203516 &nbsp; Ack Dt : 21/10/2026</div></div>
</div><div class="stamp">SHREE BALAJI<br>TRADERS<br>NOIDA</div><div class="pen">Raju</div></div></body></html>`;

fs.mkdirSync(path.join(here, 'bills'), { recursive: true });
fs.writeFileSync(path.join(here, 'bills', 'bill.html'), html);
const b = await puppeteer.launch({ headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 1300 });
await p.goto('file://' + path.join(here, 'bills', 'bill.html'), { waitUntil: 'networkidle0' });
await p.screenshot({ path: path.join(here, 'bills', 'bill.png'), omitBackground: true });
await b.close();
console.log('bills/bill.png');
