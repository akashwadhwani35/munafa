// node demo.mjs -> index.html, the clickable prototype (screens from shots/, numbers from data.mjs)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import * as D from './data.mjs';

const { inr } = D;
const here = path.dirname(new URL(import.meta.url).pathname);
const coke = D.items.find(i => i.name.startsWith('Coca'));
const surf = D.items.find(i => i.name.startsWith('Surf'));

const steps = [
  ['home', 'A shop and a bill', `${D.shop.owner} runs a kirana in Noida. His wholesaler has just dropped off stock and a bill. He taps "Pay a wholesaler bill".`],
  ['scan', 'Photograph it', 'The AI reads every line of the bill: item, quantity, the rate he paid and the printed MRP.'],
  ['bill', 'Check it', 'Each line shows what he keeps on that item. The bill\'s GST e-invoice QR is checked, so the bill is real.'],
  ['paid', 'Pay by UPI', `${inr(D.billTotal)} goes to ${D.wholesaler.name}. The bill and its 8 items are saved. He did nothing extra.`],
  ['munafa', 'Munafa', 'After a month of bills, he sees what each item earns a week: the margin times how fast it sells.'],
  ['insight', 'Same margin, different money', `${coke.name} and Surf Excel keep about the same margin. ${coke.name} sells ${Math.round(surf.days / coke.days)} times faster, so it earns ${Math.round(coke.perWeek / surf.perWeek)} times more each week.`],
  ['shelves', 'Cash on the shelves', `${inr(D.onShelfTotal)} of his money is sitting in stock. The Horlicks has been there 38 days.`],
  ['voice', 'A note every night', 'After closing, a 24-second voice note in Hindi: what he earned, what did best, one thing to change.'],
  ['credit', 'Stock on credit', `Paytm can now see his stock sell in ${D.stockDays} days, so it can pay his next bill today. He repays ${inr(D.credit.perDay)} a day from his QR. Example terms only.`],
  ['request', 'Next: the wholesaler sends the bill', 'Wholesalers on Tally send bills straight to the shop\'s Paytm, items attached. The shop just taps pay.'],
];

fs.mkdirSync(path.join(here, 'shots/web'), { recursive: true });
for (const [n] of steps) await sharp(path.join(here, 'shots', n + '.png')).resize({ height: 1688 }).png({ palette: true, quality: 92, effort: 10 }).toFile(path.join(here, 'shots/web', n + '.png'));

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Munafa, a clickable prototype</title>
<meta name="description" content="Pay your wholesaler by photographing the bill, and see what each item in your shop earns. Paytm Build for India AI Hackathon, Track 1.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="screens/liquid-glass.css">
<style>
:root{--bg:#f6f6f7;--ink:#111214;--sub:#5f6066;--navy:#002e6e}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--ink);font-family:Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
header{display:flex;justify-content:space-between;align-items:center;padding:20px 32px;max-width:1120px;margin:0 auto}
header b{font-size:20px;font-weight:800;letter-spacing:-.02em}
header a{color:var(--navy);font-weight:600;font-size:15px;text-decoration:none}
main{max-width:1120px;margin:0 auto;padding:16px 32px 48px;display:grid;grid-template-columns:1fr auto;gap:64px;align-items:center}
.n{font-size:14px;color:var(--sub);font-weight:600}
h1{font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1.08;margin:10px 0 16px}
.cap p{font-size:20px;line-height:1.5;color:#2a2b2f;max-width:30ch}
.phone{position:relative;height:min(844px,calc(100svh - 120px));aspect-ratio:390/844;justify-self:center;border:0;background:none;cursor:pointer;padding:0}
.phone img{position:absolute;inset:0;width:100%;height:100%;border-radius:46px;box-shadow:0 20px 50px rgba(0,0,0,.12);opacity:0}
.phone img.on{opacity:1}
.ctrl{display:flex;align-items:center;gap:6px;height:56px;padding:0 6px;margin-top:36px;width:max-content}
.ctrl button{border:0;background:none;font:600 16px Inter,sans-serif;color:var(--ink);height:44px;padding:0 18px;border-radius:999px;cursor:pointer}
.ctrl button:disabled{opacity:.3;cursor:default}
.ctrl button:focus-visible,.phone:focus-visible{outline:2px solid var(--navy);outline-offset:3px}
.dots{display:flex;gap:6px;padding:0 6px}
.dots i{width:8px;height:8px;border-radius:50%;background:rgba(0,0,0,.18)}
.dots i.on{background:var(--navy);width:22px;border-radius:4px}
footer{max-width:1120px;margin:0 auto;padding:0 32px 32px;font-size:13px;color:var(--sub);line-height:1.5}
@media (max-width:860px){
  header{padding:14px 16px}
  main{grid-template-columns:1fr;gap:16px;padding:0 16px 100px}
  h1{font-size:26px;margin:2px 0 6px}.cap p{font-size:16px;line-height:1.45}.n{font-size:13px}
  .phone{height:calc(100svh - 330px);min-height:340px;margin:0 auto}.phone img{border-radius:clamp(24px,5.4vh,46px)}
  .ctrl{position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);margin:0;z-index:5}
  footer{padding:0 16px 96px}
}
</style></head><body>
<header><b>Munafa</b><a href="Munafa-deck.pdf">Deck (PDF)</a></header>
<main>
  <div class="cap"><div class="n" id="n"></div><h1 id="t"></h1><p id="p"></p>
    <div class="lg ctrl" role="group" aria-label="Steps"><button id="back">Back</button><span class="dots" id="dots"></span><button id="next">Next</button></div></div>
  <button class="phone" id="phone" aria-label="Next screen">${steps.map(([n], i) => `<img src="shots/web/${n}.png" alt="" ${i ? 'loading="eager"' : ''}>`).join('')}</button>
</main>
<footer>A clickable prototype with a sample shop and a made-up bill. The working version gets built on 31 October 2026 at the Paytm Build for India AI Hackathon, Noida. Tap the phone or use the arrow keys.</footer>
<script>
const S=${JSON.stringify(steps.map(([n, t, p]) => ({ n, t, p })))};
const imgs=[...document.querySelectorAll('.phone img')],dots=document.getElementById('dots');
S.forEach(()=>dots.appendChild(document.createElement('i')));
let k=0;
function show(i){k=Math.max(0,Math.min(S.length-1,i));
  imgs.forEach((im,j)=>{im.classList.toggle('on',j===k);im.alt=j===k?S[k].t:''});
  [...dots.children].forEach((d,j)=>d.classList.toggle('on',j===k));
  document.getElementById('n').textContent=(k+1)+' of '+S.length;
  document.getElementById('t').textContent=S[k].t;document.getElementById('p').textContent=S[k].p;
  document.getElementById('back').disabled=k===0;document.getElementById('next').textContent=k===S.length-1?'Start again':'Next';
  try{history.replaceState(null,'','#'+(k+1))}catch(e){}}
const go=d=>show(k===S.length-1&&d>0?0:k+d);
document.getElementById('next').onclick=()=>go(1);document.getElementById('back').onclick=()=>go(-1);
document.getElementById('phone').onclick=()=>go(1);
addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
show((parseInt(location.hash.slice(1))||1)-1);
</script></body></html>`;
fs.writeFileSync(path.join(here, 'index.html'), html);
console.log('index.html written');
