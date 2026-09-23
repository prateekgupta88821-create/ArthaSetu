from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import copy

from .database import engine, Base
from .seed_data import PERSONAS
from .schemas import (
    UserOnboardingSchema, IncomeCreateSchema, ExpenseCreateSchema,
    GoalCreateSchema, AffordabilityInputSchema, SimulatorInputSchema,
    CopilotQuestionSchema
)
from .engines.income_engine import calculate_income_metrics
from .engines.expense_engine import analyze_expenses
from .engines.health_engine import calculate_financial_health
from .engines.savings_engine import calculate_smart_savings
from .engines.emergency_engine import calculate_emergency_fund
from .engines.affordability_engine import calculate_affordability
from .engines.gadget_engine import compare_gadgets
from .engines.vehicle_engine import calculate_vehicle_cost, compare_petrol_vs_ev
from .engines.forecast_engine import generate_cashflow_forecast
from .engines.tax_engine import generate_tax_summary
from .engines.simulator_engine import simulate_what_if_scenario
from .engines.ai_insights_engine import generate_financial_insights
from .engines.ai_copilot_engine import answer_copilot_question

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GigWealth AI Backend API",
    description="Earn Irregularly. Plan Intelligently. Spend Confidently.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory active session state preloaded with 'rahul'
CURRENT_PERSONA_KEY = "rahul"
ACTIVE_DATA = copy.deepcopy(PERSONAS["rahul"])

def get_active_profile():
    return ACTIVE_DATA["profile"]

@app.get("/")
def read_root():
    return {
        "app": "GigWealth AI",
        "tagline": "Earn Irregularly. Plan Intelligently. Spend Confidently.",
        "status": "online",
        "active_persona": ACTIVE_DATA["name"]
    }

# -------------------------------------------------------------------
# Personas & Demo Mode
# -------------------------------------------------------------------
@app.get("/api/personas/list")
def list_personas():
    return [
        {"key": "rahul", "name": "Rahul (Main Demo)", "occupation": "Delivery Partner", "badge": "Primary Demo"},
        {"key": "stable_worker", "name": "Priya Sharma", "occupation": "Freelance UI Designer", "badge": "Stable Gig Income"},
        {"key": "irregular_worker", "name": "Amit Kumar", "occupation": "Ride-Hailing Driver", "badge": "Highly Irregular"},
        {"key": "new_worker", "name": "Karan Singh", "occupation": "New Independent Courier", "badge": "New & Low Reserve"}
    ]

@app.post("/api/personas/switch/{key}")
def switch_persona(key: str):
    global CURRENT_PERSONA_KEY, ACTIVE_DATA
    if key not in PERSONAS:
        raise HTTPException(status_code=404, detail="Persona not found")
    CURRENT_PERSONA_KEY = key
    ACTIVE_DATA = copy.deepcopy(PERSONAS[key])
    return {"message": f"Switched to persona: {ACTIVE_DATA['name']}", "active_persona": ACTIVE_DATA}

@app.post("/api/personas/reset")
def reset_persona():
    global ACTIVE_DATA
    ACTIVE_DATA = copy.deepcopy(PERSONAS[CURRENT_PERSONA_KEY])
    return {"message": "Persona data reset to default demo state", "active_persona": ACTIVE_DATA}

# -------------------------------------------------------------------
# Onboarding
# -------------------------------------------------------------------
@app.post("/api/onboarding")
def create_onboarding_profile(data: UserOnboardingSchema):
    global ACTIVE_DATA
    ACTIVE_DATA["name"] = data.name
    ACTIVE_DATA["occupation"] = data.occupation
    ACTIVE_DATA["income_source"] = data.income_source
    ACTIVE_DATA["risk_preference"] = data.risk_preference

    monthly_est = data.average_daily_income * 30.0 if data.income_frequency == "Daily" else data.average_daily_income
    
    ACTIVE_DATA["profile"]["average_daily_income"] = data.average_daily_income
    ACTIVE_DATA["profile"]["average_monthly_income"] = monthly_est
    ACTIVE_DATA["profile"]["income_frequency"] = data.income_frequency
    ACTIVE_DATA["profile"]["essential_expenses"] = data.monthly_essential_expenses
    ACTIVE_DATA["profile"]["work_expenses"] = data.work_related_expenses
    ACTIVE_DATA["profile"]["existing_emi"] = data.existing_emi
    ACTIVE_DATA["profile"]["current_savings"] = data.current_savings
    ACTIVE_DATA["profile"]["emergency_target"] = data.emergency_fund_target

    if data.goal_name:
        ACTIVE_DATA["goals"].append({
            "name": data.goal_name,
            "target_amount": data.goal_target,
            "current_amount": 0.0,
            "deadline": "2027-12-31",
            "category": "Onboarding Goal"
        })

    return {"message": "Profile created successfully!", "profile": ACTIVE_DATA["profile"]}

# -------------------------------------------------------------------
# Dashboard
# -------------------------------------------------------------------
@app.get("/api/dashboard")
def get_dashboard_data():
    prof = ACTIVE_DATA["profile"]
    inc_records = ACTIVE_DATA["income_history"]
    exp_list = ACTIVE_DATA["expenses"]

    inc_metrics = calculate_income_metrics(inc_records)
    exp_metrics = analyze_expenses(exp_list, inc_metrics["average_income"])
    
    health = calculate_financial_health(
        avg_income=inc_metrics["average_income"],
        stability_score=inc_metrics["stability_score"],
        total_expenses=exp_metrics["total_expenses"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )

    smart_savings = calculate_smart_savings(
        current_month_income=inc_metrics["average_income"],
        average_income=inc_metrics["average_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )

    emergency = calculate_emergency_fund(
        essential_monthly_expenses=exp_metrics["essential_expenses"],
        current_savings=prof["current_savings"],
        target_months=prof.get("emergency_months", 6)
    )

    insights = generate_financial_insights(prof, exp_list, inc_records)

    surplus = max(0.0, inc_metrics["average_income"] - exp_metrics["total_expenses"])

    return {
        "user_name": ACTIVE_DATA["name"],
        "occupation": ACTIVE_DATA["occupation"],
        "risk_preference": ACTIVE_DATA["risk_preference"],
        "income": {
            "average_monthly_income": inc_metrics["average_income"],
            "current_month_income": inc_records[-1] if inc_records else inc_metrics["average_income"],
            "typical_range": inc_metrics["typical_range"],
            "stability_score": inc_metrics["stability_score"],
            "trend": inc_metrics["trend"]
        },
        "expenses": {
            "total_expenses": exp_metrics["total_expenses"],
            "essential_expenses": exp_metrics["essential_expenses"],
            "work_expenses": exp_metrics["work_expenses"],
            "financial_expenses": exp_metrics["financial_expenses"],
            "discretionary_expenses": exp_metrics["discretionary_expenses"],
            "needs_vs_wants": exp_metrics["needs_vs_wants_ratio"]
        },
        "savings_and_emergency": {
            "current_savings": prof["current_savings"],
            "emergency_target": emergency["target_amount"],
            "emergency_progress_pct": emergency["progress_pct"],
            "months_covered": emergency["essential_monthly_expenses"],
            "available_surplus": round(surplus, 2),
            "recommended_savings": smart_savings["recommended_savings"]
        },
        "financial_health": {
            "score": health["score"],
            "grade": health["grade"],
            "what_is_good": health["what_is_good"],
            "needs_attention": health["needs_attention"]
        },
        "latest_insights": insights[:3]
    }

# -------------------------------------------------------------------
# Income Analyzer
# -------------------------------------------------------------------
@app.get("/api/income")
def get_income_analysis():
    records = ACTIVE_DATA["income_history"]
    metrics = calculate_income_metrics(records)
    return {
        "metrics": metrics,
        "raw_history": records,
        "income_source": ACTIVE_DATA["income_source"]
    }

@app.post("/api/income")
def add_income_entry(entry: IncomeCreateSchema):
    ACTIVE_DATA["income_history"].append(entry.amount)
    # Recalculate average
    new_avg = sum(ACTIVE_DATA["income_history"]) / len(ACTIVE_DATA["income_history"])
    ACTIVE_DATA["profile"]["average_monthly_income"] = round(new_avg, 2)
    return {"message": "Income entry added successfully", "history": ACTIVE_DATA["income_history"]}

# -------------------------------------------------------------------
# Expense Tracker
# -------------------------------------------------------------------
@app.get("/api/expenses")
def get_expense_tracker():
    exp_list = ACTIVE_DATA["expenses"]
    avg_inc = ACTIVE_DATA["profile"]["average_monthly_income"]
    analysis = analyze_expenses(exp_list, avg_inc)
    return {
        "analysis": analysis,
        "expenses": exp_list
    }

@app.post("/api/expenses")
def add_expense_entry(entry: ExpenseCreateSchema):
    new_exp = {
        "title": entry.title,
        "category": entry.category,
        "group": entry.group,
        "amount": entry.amount,
        "date": entry.date,
        "notes": entry.notes
    }
    ACTIVE_DATA["expenses"].append(new_exp)
    return {"message": "Expense added successfully", "expenses": ACTIVE_DATA["expenses"]}

@app.delete("/api/expenses/{index}")
def delete_expense_entry(index: int):
    if 0 <= index < len(ACTIVE_DATA["expenses"]):
        removed = ACTIVE_DATA["expenses"].pop(index)
        return {"message": f"Removed expense '{removed['title']}'"}
    raise HTTPException(status_code=400, detail="Invalid expense index")

# -------------------------------------------------------------------
# Financial Health Engine
# -------------------------------------------------------------------
@app.get("/api/health")
def get_health_details():
    prof = ACTIVE_DATA["profile"]
    inc_metrics = calculate_income_metrics(ACTIVE_DATA["income_history"])
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], inc_metrics["average_income"])
    
    health = calculate_financial_health(
        avg_income=inc_metrics["average_income"],
        stability_score=inc_metrics["stability_score"],
        total_expenses=exp_metrics["total_expenses"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"],
        discretionary_expenses=exp_metrics["discretionary_expenses"]
    )
    return health

# -------------------------------------------------------------------
# Smart Savings & Emergency Fund
# -------------------------------------------------------------------
@app.get("/api/savings")
def get_savings_recommendations():
    prof = ACTIVE_DATA["profile"]
    inc_metrics = calculate_income_metrics(ACTIVE_DATA["income_history"])
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], inc_metrics["average_income"])
    
    smart = calculate_smart_savings(
        current_month_income=inc_metrics["average_income"],
        average_income=inc_metrics["average_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"],
        active_goals=ACTIVE_DATA["goals"]
    )

    emergency = calculate_emergency_fund(
        essential_monthly_expenses=exp_metrics["essential_expenses"],
        current_savings=prof["current_savings"],
        target_months=prof.get("emergency_months", 6)
    )

    return {
        "smart_savings": smart,
        "emergency_fund": emergency
    }

# -------------------------------------------------------------------
# Goals
# -------------------------------------------------------------------
@app.get("/api/goals")
def get_goals():
    return ACTIVE_DATA["goals"]

@app.post("/api/goals")
def add_goal(goal: GoalCreateSchema):
    new_g = {
        "name": goal.name,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "deadline": goal.deadline,
        "category": goal.category
    }
    ACTIVE_DATA["goals"].append(new_g)
    return {"message": "Goal added successfully", "goals": ACTIVE_DATA["goals"]}

# -------------------------------------------------------------------
# Educational Investment Guidance
# -------------------------------------------------------------------
@app.get("/api/investing")
def get_investment_guidance():
    prof = ACTIVE_DATA["profile"]
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])
    emergency = calculate_emergency_fund(exp_metrics["essential_expenses"], prof["current_savings"])

    is_emergency_safe = emergency["progress_pct"] >= 70.0
    
    options = [
        {
            "name": "Bank Fixed Deposit (FD)",
            "risk_level": "Very Low",
            "liquidity": "Moderate (Premature withdrawal available with nominal penalty)",
            "horizon": "6 - 36 Months",
            "indicative_return": "6.5% - 7.5% p.a.",
            "description": "Guaranteed principal protection for surplus cash reserves."
        },
        {
            "name": "Recurring Deposit (RD)",
            "risk_level": "Very Low",
            "liquidity": "Monthly Commitment",
            "horizon": "12 - 36 Months",
            "indicative_return": "6.8% - 7.2% p.a.",
            "description": "Ideal for gig workers to build monthly discipline from surplus earnings."
        },
        {
            "name": "Public Provident Fund (PPF) / Govt Savings",
            "risk_level": "Zero (Government Backed)",
            "liquidity": "Low (15-year lock-in with partial loan options)",
            "horizon": "Long Term (5+ Years)",
            "indicative_return": "7.1% p.a. (Tax Free)",
            "description": "Long-term wealth building with EEE tax benefits under Old Tax Regime."
        }
    ]

    return {
        "is_emergency_safe": is_emergency_safe,
        "warning_banner": None if is_emergency_safe else "Consider strengthening your emergency reserve (target 3–6 months) before taking investment risk.",
        "risk_preference": ACTIVE_DATA["risk_preference"],
        "guidance_options": options,
        "disclaimer": "Educational planning information only. Does not constitute licensed investment advice or guaranteed return promises."
    }

# -------------------------------------------------------------------
# Can I Afford It?
# -------------------------------------------------------------------
@app.post("/api/affordability")
def check_affordability(data: AffordabilityInputSchema):
    prof = ACTIVE_DATA["profile"]
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])

    result = calculate_affordability(
        product_price=data.product_price,
        down_payment=data.down_payment,
        emi_months=data.emi_months,
        annual_interest_rate=data.annual_interest_rate,
        monthly_income=prof["average_monthly_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        existing_emi=prof["existing_emi"],
        current_savings=prof["current_savings"]
    )
    return result

# -------------------------------------------------------------------
# Gadgets Advisor
# -------------------------------------------------------------------
@app.get("/api/gadgets/default-comparison")
def get_default_gadgets():
    prof = ACTIVE_DATA["profile"]
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])

    demo_gadgets = [
        {"name": "iPhone 15 (128GB)", "category": "Smartphone", "price": 60000.0, "down_payment": 10000.0, "tenure_months": 24, "interest_rate": 12.0},
        {"name": "OnePlus 12R", "category": "Smartphone", "price": 38999.0, "down_payment": 5000.0, "tenure_months": 18, "interest_rate": 11.0},
        {"name": "Redmi Note 13 Pro", "category": "Smartphone", "price": 21999.0, "down_payment": 3000.0, "tenure_months": 12, "interest_rate": 10.0}
    ]

    comp = compare_gadgets(
        gadgets=demo_gadgets,
        monthly_income=prof["average_monthly_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        existing_emi=prof["existing_emi"],
        current_savings=prof["current_savings"]
    )
    return comp

# -------------------------------------------------------------------
# Vehicle Planner
# -------------------------------------------------------------------
@app.get("/api/vehicles/ev-comparison")
def get_vehicle_ev_comparison():
    prof = ACTIVE_DATA["profile"]
    comp = compare_petrol_vs_ev(
        daily_km=75.0,
        work_days=26,
        petrol_price=100.0,
        elec_price=8.0,
        monthly_income=prof["average_monthly_income"]
    )
    return comp

# -------------------------------------------------------------------
# Tax Assistant
# -------------------------------------------------------------------
@app.get("/api/tax")
def get_tax_info():
    prof = ACTIVE_DATA["profile"]
    summary = generate_tax_summary(
        monthly_income=prof["average_monthly_income"],
        expenses=ACTIVE_DATA["expenses"],
        occupation=ACTIVE_DATA["occupation"]
    )
    return summary

# -------------------------------------------------------------------
# Cashflow Forecast
# -------------------------------------------------------------------
@app.get("/api/forecast")
def get_forecast():
    prof = ACTIVE_DATA["profile"]
    inc_records = ACTIVE_DATA["income_history"]
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])

    fc = generate_cashflow_forecast(
        historical_incomes=inc_records,
        historical_expenses=[exp_metrics["total_expenses"]],
        avg_income=prof["average_monthly_income"],
        avg_expense=exp_metrics["total_expenses"]
    )
    return fc

# -------------------------------------------------------------------
# Simulator
# -------------------------------------------------------------------
@app.post("/api/simulator")
def run_simulation(data: SimulatorInputSchema):
    prof = ACTIVE_DATA["profile"]
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])
    inc_metrics = calculate_income_metrics(ACTIVE_DATA["income_history"])

    base_p = {
        "average_income": prof["average_monthly_income"],
        "total_expenses": exp_metrics["total_expenses"],
        "essential_expenses": exp_metrics["essential_expenses"],
        "work_expenses": exp_metrics["work_expenses"],
        "emi_amount": prof["existing_emi"],
        "current_savings": prof["current_savings"],
        "emergency_target": prof["emergency_target"],
        "stability_score": inc_metrics["stability_score"]
    }

    res = simulate_what_if_scenario(
        base_profile=base_p,
        income_change_pct=data.income_change_pct,
        expense_change_pct=data.expense_change_pct,
        new_monthly_emi=data.new_monthly_emi,
        one_time_purchase_amount=data.one_time_purchase_amount,
        vehicle_switch_cost_delta=data.vehicle_switch_cost_delta
    )
    return res

# -------------------------------------------------------------------
# AI Copilot & Insights
# -------------------------------------------------------------------
@app.post("/api/ai/chat")
def chat_copilot(data: CopilotQuestionSchema):
    prof = ACTIVE_DATA["profile"]
    inc_metrics = calculate_income_metrics(ACTIVE_DATA["income_history"])
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])
    
    smart = calculate_smart_savings(
        current_month_income=prof["average_monthly_income"],
        average_income=prof["average_monthly_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )
    
    health = calculate_financial_health(
        avg_income=prof["average_monthly_income"],
        stability_score=inc_metrics["stability_score"],
        total_expenses=exp_metrics["total_expenses"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )

    ctx = {
        "user_name": ACTIVE_DATA["name"],
        "occupation": ACTIVE_DATA["occupation"],
        "average_income": prof["average_monthly_income"],
        "typical_range": inc_metrics["typical_range"],
        "essential_expenses": exp_metrics["essential_expenses"],
        "work_expenses": exp_metrics["work_expenses"],
        "emi_amount": prof["existing_emi"],
        "current_savings": prof["current_savings"],
        "emergency_target": prof["emergency_target"],
        "recommended_savings": smart["recommended_savings"],
        "health_score": health["score"],
        "health_grade": health["grade"]
    }

    ans = answer_copilot_question(data.question, ctx)
    return ans

@app.get("/api/insights")
def get_insights():
    insights = generate_financial_insights(
        profile=ACTIVE_DATA["profile"],
        expenses=ACTIVE_DATA["expenses"],
        income_records=ACTIVE_DATA["income_history"]
    )
    return insights

# -------------------------------------------------------------------
# Snapshot
# -------------------------------------------------------------------
@app.get("/api/snapshot")
def get_final_snapshot():
    prof = ACTIVE_DATA["profile"]
    inc_metrics = calculate_income_metrics(ACTIVE_DATA["income_history"])
    exp_metrics = analyze_expenses(ACTIVE_DATA["expenses"], prof["average_monthly_income"])

    smart = calculate_smart_savings(
        current_month_income=prof["average_monthly_income"],
        average_income=prof["average_monthly_income"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )

    health = calculate_financial_health(
        avg_income=prof["average_monthly_income"],
        stability_score=inc_metrics["stability_score"],
        total_expenses=exp_metrics["total_expenses"],
        essential_expenses=exp_metrics["essential_expenses"],
        work_expenses=exp_metrics["work_expenses"],
        emi_amount=prof["existing_emi"],
        current_savings=prof["current_savings"],
        emergency_target=prof["emergency_target"]
    )

    emergency = calculate_emergency_fund(
        essential_monthly_expenses=exp_metrics["essential_expenses"],
        current_savings=prof["current_savings"]
    )

    surplus = max(0.0, prof["average_monthly_income"] - exp_metrics["total_expenses"])

    insights = generate_financial_insights(prof, ACTIVE_DATA["expenses"], ACTIVE_DATA["income_history"])
    top_insight = insights[0]["message"] if insights else "Keep maintaining your monthly savings buffer."

    return {
        "title": "GigWealth Financial Snapshot",
        "user_name": ACTIVE_DATA["name"],
        "occupation": ACTIVE_DATA["occupation"],
        "average_monthly_income": prof["average_monthly_income"],
        "typical_income_range": f"₹{int(inc_metrics['typical_range'][0]):,} – ₹{int(inc_metrics['typical_range'][1]):,}",
        "essential_expenses": exp_metrics["essential_expenses"],
        "work_expenses": exp_metrics["work_expenses"],
        "current_savings": prof["current_savings"],
        "emergency_fund_progress": f"{emergency['progress_pct']}% ({round(prof['current_savings']/exp_metrics['essential_expenses'], 1)} months)",
        "existing_emi": prof["existing_emi"],
        "monthly_surplus": round(surplus, 2),
        "recommended_savings": smart["recommended_savings"],
        "goal_progress": "In Progress (60% target reached)",
        "financial_health": f"{health['score']}/100 ({health['grade']})",
        "major_spending_insight": top_insight,
        "next_suggested_action": health["action_recommendations"][0] if health["action_recommendations"] else "Maintain emergency reserve contributions."
    }
