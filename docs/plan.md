# Cryptocurrency Portfolio Tracker — Project Plan

## Context

You are building a personal cryptocurrency portfolio tracker from scratch as a learning project. The goal is to track which coins you hold, how much, at what price, and what your portfolio is currently worth based on live market data.

**Approach:** Frontend-first. Build the full UI with CRUD and live prices using local storage as a temporary database. The backend and real database come in a later phase once the UI is solid and working.

---

## Recommended Tech Stack

### Phase 1–3 (Frontend Only)
| Tool | Purpose |
|---|---|
| **React** | UI component framework |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Fast dev server and bundler |
| **localStorage** | Temporary data persistence (browser-native, no server needed) |
| **CoinGecko API** | Free live crypto prices — called directly from React |

### Phase 4+ (Backend — future)
| Tool | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Prisma** | ORM for database access |
| **PostgreSQL** | Relational database |

### Why frontend-first works here
- CoinGecko's public API supports browser requests (CORS enabled) — no backend proxy needed.
- `localStorage` stores JSON in the browser, so CRUD works without any server.
- You ship a usable app faster and learn React deeply before adding backend complexity.
- When the backend is added later, you replace `localStorage` calls with `fetch` calls — a clean, incremental upgrade.

---

## Architecture (Phases 1–3)

```
[Browser]
    ↕
[Vite Dev Server] → React + Tailwind (port 5173)
    ↕ fetch
[CoinGecko Public API] — live prices only, no auth needed
    ↕
[localStorage] — holds portfolio holdings (CRUD)
```

---

## Phases

### Phase 1 — Project Setup & Foundation
**Goal:** Get a running React app with Tailwind working.

- [ ] Scaffold project: `npm create vite@latest crypto-portfolio -- --template react`
- [ ] Install and configure Tailwind CSS
- [ ] Create a basic `App.jsx` layout (header, main content area)
- [ ] Confirm the app runs in the browser with `npm run dev`

**Deliverable:** Vite dev server loads a styled React page in the browser.

---

### Phase 2 — Local Storage CRUD
**Goal:** Build the data layer using `localStorage` so holdings persist across page refreshes.

Data shape stored in `localStorage` under the key `"holdings"`:
```json
[
  {
    "id": "uuid",
    "coinId": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "quantity": 0.5,
    "avgBuyPrice": 60000
  }
]
```

Utility functions to write (in `src/utils/storage.js`):
- `getHoldings()` — reads and parses from localStorage
- `saveHoldings(holdings)` — stringifies and writes to localStorage
- `addHolding(holding)` — appends a new entry
- `updateHolding(id, changes)` — merges changes into existing entry
- `deleteHolding(id)` — removes entry by id

- [ ] Write the storage utility file
- [ ] Add an `AddHoldingForm` component (inputs: coin name, symbol, quantity, avg buy price)
- [ ] Add a `HoldingsTable` component that lists all saved holdings
- [ ] Wire up edit and delete buttons per row

**Deliverable:** You can add, edit, and delete holdings — data survives a page refresh.

---

### Phase 3 — Live Prices via CoinGecko API
**Goal:** Fetch real-time prices and display current portfolio value.

CoinGecko endpoint to use (free, no API key):
```
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true
```

- [ ] Write a `fetchPrices(coinIds)` utility in `src/utils/prices.js`
- [ ] On app load, fetch prices for all coins currently in holdings
- [ ] Calculate per-holding: `currentValue = quantity × currentPrice`
- [ ] Calculate per-holding: `profitLoss = currentValue - (quantity × avgBuyPrice)`
- [ ] Add a `SummaryCard` component showing total portfolio value and total P&L
- [ ] Show a loading state while prices are fetching
- [ ] Handle API errors gracefully (show a message, don't crash)

**Deliverable:** App displays live prices, current value, and profit/loss for each holding.

---

### Phase 4 — Polish
**Goal:** Make the app look and feel complete before the backend phase.

- [ ] Responsive layout (works on mobile screens)
- [ ] Color-code profit (green) vs loss (red)
- [ ] Format numbers as currency (`$1,234.56`)
- [ ] Empty state when no holdings are added yet
- [ ] Confirm dialog before deleting a holding

**Deliverable:** A polished, production-looking frontend app.

---

### Phase 5 — Backend + Database (future phase)
Once the frontend is complete and working, add persistence beyond the browser:

- Set up Node.js + Express API server
- Set up PostgreSQL + Prisma schema (User, Holding, Transaction tables)
- Replace `localStorage` utility calls with `fetch` calls to the Express API
- Add user authentication

---

## Verification Plan

After each phase:
1. Run `npm run dev` — confirm the app builds and opens in the browser
2. Open browser DevTools → **Application → Local Storage** — confirm data is stored/updated correctly
3. Open browser DevTools → **Network tab** — confirm CoinGecko API calls succeed (Phase 3+)
4. Refresh the page — confirm holdings still appear (localStorage persists)

---

## Key Files (once Phases 1–3 are built)

```
crypto-portfolio/
├── src/
│   ├── components/
│   │   ├── AddHoldingForm.jsx
│   │   ├── HoldingsTable.jsx
│   │   └── SummaryCard.jsx
│   ├── utils/
│   │   ├── storage.js      ← localStorage CRUD helpers
│   │   └── prices.js       ← CoinGecko fetch helper
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```
