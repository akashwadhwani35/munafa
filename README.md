# Munafa by Paytm

Pay your wholesaler by photographing the bill, and find out what each item in your shop really earns.

Entry for the Paytm Build for India AI Hackathon, Delhi. Track 1: Merchant Growth AI.

- **Clickable demo:** https://akashwadhwani35.github.io/munafa/
- **Deck (PDF):** [Munafa-deck.pdf](Munafa-deck.pdf)

## The idea

Paytm sees the money that comes into a kirana by QR. It doesn't see what the shop buys, what each item earns, or how much cash sits on the shelves. The wholesaler's bill already has all of that: item, quantity, the rate paid and the printed MRP. A kirana sells roughly what it buys, so the gap between two bills for the same item tells you how fast it sells.

Owners won't scan bills to get a report, but they will to pay. So in Munafa, scanning the bill is how you pay it:

1. Scan the wholesaler's bill. A vision model reads every line.
2. Check it. Each line shows the margin, the GST e-invoice QR is verified, and the wholesaler is found on Paytm by GSTIN or phone.
3. Pay now or on the due date (wholesalers usually give about 7 days), with a reminder.
4. Every bill lands in a ledger the owner can send to his CA or into Tally in one tap.
5. After a month: what each item earns a week (margin times speed), cash on the shelves, and a short note in Hindi every night.
6. Because Paytm can now see stock turn over, it can offer stock credit: pay the next bill today, repay a little each day from the QR.

Later: wholesalers send bills straight from Tally to the shop's Paytm, and Munafa uses IndiaMART to find the same item cheaper nearby.

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | The clickable prototype: 13 screens, live HTML inside an iPhone 17 Pro frame |
| `Munafa-deck.pdf`, `deck.html` | The pitch deck |
| `data.mjs` | The sample shop and bill. Every number on the screens and slides comes from here |
| `bill.mjs` | Draws the stand-in bill photo in `bills/` |
| `app.mjs` | Builds `index.html` |
| `shots.mjs`, `deck.mjs` | Photograph each screen in its frame, then build the deck from them |

```
npm install
npm run build
```

This is a hackathon concept, not a Paytm product. The shop, the wholesaler, the bill and the IndiaMART quotes are made up for the demo, and the bill photo is a stand-in until we photograph real ones. The working version, which reads a real bill, is built on 31 October 2026 at the hackathon in Noida.

Akash Wadhwani · [sheets.works](https://sheets.works)
