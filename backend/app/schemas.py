from pydantic import BaseModel
from typing import Optional, List

class UserOnboardingSchema(BaseModel):
    name: str
    occupation: str
    income_source: str
    average_daily_income: float
    income_frequency: str
    monthly_essential_expenses: float
    work_related_expenses: float
    existing_emi: float
    current_savings: float
    emergency_fund_target: float
    risk_preference: str = "Conservative"
    goal_name: Optional[str] = "Emergency Reserve"
    goal_target: Optional[float] = 30000.0

class IncomeCreateSchema(BaseModel):
    source: str
    amount: float
    frequency: str = "Monthly"
    date: str
    notes: Optional[str] = ""

class ExpenseCreateSchema(BaseModel):
    title: str
    category: str
    group: str
    amount: float
    date: str
    notes: Optional[str] = ""

class GoalCreateSchema(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: str
    category: str = "General"

class AffordabilityInputSchema(BaseModel):
    product_price: float
    down_payment: float = 0.0
    emi_months: int = 12
    annual_interest_rate: float = 12.0

class SimulatorInputSchema(BaseModel):
    income_change_pct: float = 0.0
    expense_change_pct: float = 0.0
    new_monthly_emi: float = 0.0
    one_time_purchase_amount: float = 0.0
    vehicle_switch_cost_delta: float = 0.0

class CopilotQuestionSchema(BaseModel):
    question: str
