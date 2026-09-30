# JanSetu AI — Digital Governance Command Center

A working frontend prototype built for **GDG Lucknow — Code for Communities, 2nd Edition** (Problem Statement #01: Digital Governance).

JanSetu AI turns raw citizen complaints into prioritized, evidence-backed development decisions for local government — combining a live issue map, AI-recommended priorities, and an explainable "why this area" breakdown.

## Live Demo

> Add your deployed link here (Vercel / Netlify / GitHub Pages) once hosted.

## Features

- 📊 **Command center dashboard** — key civic metrics at a glance
- 🗺️ **AI Priority Map** — hotspot visualization across wards
- 🤖 **AI-recommended priorities** — ranked by urgency and impact
- 🧾 **Citizen issue submission** — text-based request form
- 🌐 **English / Hindi interface toggle**
- 🔍 **AI analysis simulation** — category, severity, duplicate cluster, and priority score generated from the submitted text (keyword-based, no external API required)
- 📈 **Issue-category analytics** — breakdown by category
- 🧠 **Explainable AI section** — shows *why* an area was prioritized

## Tech Stack

- **React 18** + **Vite**
- Plain CSS (no external UI library)

> The AI analysis currently runs on a local keyword-matching function (`src/utils/analyze.js`), not a live model. See [Roadmap](#roadmap) for the planned Gemini integration.

## Project Structure

```
jansetu-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        # entry point
    ├── App.jsx         # main page and state
    ├── index.css       # all styles
    ├── data.js         # demo data (metrics, priorities, categories)
    ├── utils/
    │   └── analyze.js  # keyword-based issue classifier (category, severity, priority)
    └── components/
        ├── Sidebar.jsx
        ├── Header.jsx
        ├── MetricCards.jsx
        ├── PriorityMap.jsx
        ├── RecommendedPriorities.jsx
        ├── CategoryChart.jsx
        ├── ExplainableAI.jsx
        ├── ReportModal.jsx
        └── AnalysisResult.jsx
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)

### Installation

```bash
git clone https://github.com/<your-username>/jansetu-ai.git
cd jansetu-ai
npm install
```

### Run locally

```bash
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in your browser.

### Build for production

```bash
npm run build
```

## How the AI Analysis Works (Current Prototype)

When a citizen submits an issue, `src/utils/analyze.js` reads the text and:

1. Matches keywords (English + common Hindi/Hinglish terms) to detect **category** — Water & drainage, Road, Electricity, or Healthcare
2. Flags **severity** as High if urgency words are present (e.g. "danger", "flood", "emergency"), otherwise scales by message length
3. Generates a **duplicate cluster** estimate and a **priority score** (0–100) from the text

This keeps the demo dynamic and responsive to real input while the live AI/backend is still being built.

## Roadmap

- [ ] Replace keyword matching with real **Gemini API** calls for category/severity/duplicate-cluster detection
- [ ] Add a **Python (FastAPI)** backend to serve AI analysis and priority scoring
- [ ] Store requests in **Firebase / Firestore**
- [ ] Plot real coordinates with the **Google Maps API**
- [ ] Full Hindi translation across all screens (currently header-only)
- [ ] Add authentication for government/admin users

## Team

> Add your team name and members here.

## License

> Add a license (e.g. MIT) if you plan to open-source this, or remove this section.

## Acknowledgements

Built for **GDG Lucknow — Code for Communities, 2nd Edition**.
