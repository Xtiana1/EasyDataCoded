# Easy Data — Frontend Prototype

A responsive React/Vite frontend based on the 12 supplied Easy Data screens.

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
1. Extract the ZIP.
2. Open the project folder in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Included flows
- Homepage
- Choose product (tapping a product immediately advances to recipient number)
- Enter recipient number
- Select bundle
- Confirm purchase
- Simulated payment screen
- Purchase success
- Check order status (recent orders appear after checking; See All opens order history)
- Order history with status filters
- FAQs with accordion answers
- WhatsApp support and channel links

## Important notes
- This is frontend-only. Orders are demo data held in React state and reset on refresh.
- Payment is simulated; no real money is charged and no data bundle is delivered.
- Update `WHATSAPP_URL` and `CHANNEL_URL` near the top of `src/main.jsx` with the real WhatsApp support and channel links.
- Network logos are recreated with CSS placeholders. Replace them with official logo assets if you have permission to use them.
- The screenshot references include Paystack styling. This project does not integrate with Paystack; the payment screen is only a visual interaction demo.
