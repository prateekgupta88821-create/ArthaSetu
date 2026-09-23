# GigWealth AI

> **Earn Irregularly. Plan Intelligently. Spend Confidently.**

An AI-powered financial planning and decision-support platform designed specifically for gig workers (delivery partners, ride-hailing drivers, freelancers, independent contractors) who earn irregular, fluctuating incomes.

---

## 🚀 Key Features

1. **User Onboarding & 4 Preloaded Demo Personas**
   - 1-Click persona switching: **Rahul (Delivery Partner - Main Demo)**, **Priya (Stable Worker)**, **Amit (Irregular Driver)**, **Karan (New Courier)**.
2. **Modern Financial Dashboard**
   - Monthly Income, Typical Volatility Range, Essential Expenses, Surplus, Emergency Fund, Health Score (0-100), Latest AI Insights, Quick Action bar.
3. **Income Volatility Analyzer**
   - Calculates Average, Median, Min, Max, Typical Volatility Range, Month-to-Month variation, and Stability Score out of 100.
4. **Expense Tracker with Needs vs Wants**
   - Categorizes Essential Living, Work/Vehicle Costs, Financial Obligations (EMIs), and Discretionary spending.
5. **Deterministic Financial Health Engine**
   - Computes a 0-100 Financial Health Index with pros, cons, and actionable next steps.
6. **Smart Adaptive Savings Engine**
   - Recommends savings dynamically based on monthly income vs fixed obligations + emergency gap.
7. **Emergency Fund Planner**
   - 3 / 6 / 9 months target setting for emergency fund.
8. **Educational Investment Guidance**
   - Checks emergency fund & debt before offering guidance on FD/RD/Govt savings options.
9. **"Can I Afford It?" Universal Calculator**
   - Calculates EMI, interest, post-purchase buffer, and categorizes risk into 4 tiers (*Manageable*, *Moderate Pressure*, *High Pressure*, *Financially Stretching*).
10. **Gadget Affordability Advisor**
    - Side-by-side comparison of 3 gadgets with safe budget recommendations based on monthly surplus.
11. **Vehicle Affordability & Petrol vs EV Planner**
    - Total monthly cost of ownership formula (EMI + Fuel/Energy + Maintenance + Insurance). Petrol vs EV cost-per-kilometer comparison.
12. **What-If Scenario Simulator**
    - Interactive sliders for income shifts (-40% to +50%), expense spikes, new EMIs, with before/after comparative metrics.
13. **Cash-Flow Forecast**
    - 7-day, 30-day, and 90-day cash flow projections with uncertainty bands.
14. **Tax Organization Assistant**
    - Deductible work-expense categorization, estimated taxable base, tax checklist, and disclaimers.
15. **AI Financial Copilot**
    - Natural language AI Chat assistant grounded strictly in stored database metrics.
16. **GigWealth Final Financial Snapshot**
    - 1-page complete summary card ready for hackathon presentation.

---

## 🛠️ Project Architecture

```
ArthaSetu/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI server entry point & endpoints
│   │   ├── database.py                 # SQLite SQLAlchemy setup
│   │   ├── models.py                   # ORM Models
│   │   ├── schemas.py                  # Pydantic Schemas
│   │   ├── seed_data.py                # Preloaded personas (Rahul, Priya, Amit, Karan)
│   │   └── engines/                    # Deterministic Financial Engines
│   │       ├── income_engine.py
│   │       ├── expense_engine.py
│   │       ├── health_engine.py
│   │       ├── savings_engine.py
│   │       ├── emergency_engine.py
│   │       ├── affordability_engine.py
│   │       ├── gadget_engine.py
│   │       ├── vehicle_engine.py
│   │       ├── forecast_engine.py
│   │       ├── tax_engine.py
│   │       ├── simulator_engine.py
│   │       ├── ai_insights_engine.py
│   │       └── ai_copilot_engine.py
│   ├── requirements.txt
│   └── test_backend.py
├── src/                                # React Vite Frontend
│   ├── components/
│   │   ├── Navbar.jsx                  # Header with Persona Switcher
│   │   ├── Sidebar.jsx                 # Navigation sidebar
│   │   ├── DashboardView.jsx           # Dashboard overview
│   │   ├── IncomeView.jsx              # Income analyzer
│   │   ├── ExpensesView.jsx            # Expense tracker
│   │   ├── SavingsView.jsx             # Smart adaptive savings
│   │   ├── GoalsView.jsx               # Goal planner
│   │   ├── InvestingView.jsx           # Conservative guidance
│   │   ├── AffordabilityView.jsx       # Can I Afford It calculator
│   │   ├── GadgetAdvisorView.jsx       # Gadget advisor
│   │   ├── VehiclePlannerView.jsx      # Vehicle TCO & EV planner
│   │   ├── SimulatorView.jsx           # What-If simulator
│   │   ├── ForecastView.jsx            # Cash-flow forecast
│   │   ├── TaxAssistantView.jsx        # Tax assistant
│   │   ├── AICopilotView.jsx           # AI Copilot chat
│   │   ├── OnboardingModal.jsx         # Onboarding wizard
│   │   └── SnapshotModal.jsx           # Final financial snapshot
│   ├── context/
│   │   └── UserContext.jsx             # React context for persona & state
│   ├── services/
│   │   └── api.js                      # API client
│   ├── App.jsx
│   └── index.css                       # Tailwind CSS & custom glassmorphism
├── package.json
└── vite.config.js
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
pip install -r backend/requirements.txt
```

### 3. Run Application

**Terminal 1 — Backend FastAPI Server:**
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```

**Terminal 2 — Frontend Dev Server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Privacy Notice
- **Synthetic Demo Data**: All calculations operate on local synthetic demo data.
- **No Sensitive Credential Collection**: The app **never** asks for real bank passwords, UPI PINs, card PINs, or OTPs.

---

## 📜 License
MIT License - Built for Hackathon Presentation.
