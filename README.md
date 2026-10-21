# Munafa

Pay your wholesaler by photographing the bill, and find out what each item in your shop really earns.

Entry for the Paytm Build for India AI Hackathon, Delhi. Track 1: Merchant Growth AI.

- **Clickable demo:** https://akashwadhwani35.github.io/munafa/
- **Deck (PDF):** [Munafa-deck.pdf](Munafa-deck.pdf)

## The idea

Paytm sees the money that comes into a kirana by QR. It doesn't see what the shop buys, what each item earns, or how much cash sits on the shelves. The wholesaler's bill already has all of that: item, quantity, the rate paid and the printed MRP. A kirana sells roughly what it buys, so the gap between two bills for the same item tells you how fast it sells.

Owners won't photograph bills to get a report, but they will to pay. So in Munafa the photo is the payment:

1. Photograph the wholesaler's bill. A vision model reads every line.
2. Check it. Each line shows the margin, and the GST e-invoice QR is verified.
3. Pay by UPI. The bill and its items are saved.
4. After a month: what each item earns a week (margin times speed), cash on the shelves, and a short voice note in Hindi every night.
5. Because Paytm can now see the stock turn over, it can offer stock on credit: pay the next bill today, repay a little each day from the QR.

Next step: wholesalers send bills straight from Tally to the shop's Paytm, so there's no photo at all.

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | The clickable prototype (10 screens) |
| `Munafa-deck.pdf`, `deck.html` | The pitch deck |
| `data.mjs` | The sample shop and bill. Every number on the screens and slides comes from here |
| `screens.mjs` | Builds each app screen as HTML and screenshots it into `shots/` |
| `deck.mjs`, `demo.mjs` | Build the deck and the prototype |

```
npm install
node screens.mjs && node deck.mjs && node demo.mjs
```

The shop, the wholesaler and the bill are made up for the demo. The working version, which reads a real bill, is built on 31 October 2026 at the hackathon in Noida.

Akash Wadhwani · [sheets.works](https://sheets.works)
