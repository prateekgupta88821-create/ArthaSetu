from .health_engine import calculate_financial_health
from .savings_engine import calculate_smart_savings

def simulate_what_if_scenario(
    base_profile: dict,
    income_change_pct: float = 0.0,
    expense_change_pct: float = 0.0,
    new_monthly_emi: float = 0.0,
    one_time_purchase_amount: float = 0.0,
    vehicle_switch_cost_delta: float = 0.0
) -> dict:
    """
    Simulates financial outcome before and after scenario shifts.
    """
    base_inc = base_profile.get("average_income", 30000.0)
    base_exp = base_profile.get("total_expenses", 18000.0)
    base_essential = base_profile.get("essential_expenses", 12000.0)
    base_work = base_profile.get("work_expenses", 4000.0)
    base_emi = base_profile.get("emi_amount", 2000.0)
    base_savings = base_profile.get("current_savings", 18000.0)
    base_emergency_target = base_profile.get("emergency_target", 30000.0)
    base_stability = base_profile.get("stability_score", 75.0)

    # 1. Base State Calculation
    base_health = calculate_financial_health(
        avg_income=base_inc,
        stability_score=base_stability,
        total_expenses=base_exp,
        essential_expenses=base_essential,
        work_expenses=base_work,
        emi_amount=base_emi,
        current_savings=base_savings,
        emergency_target=base_emergency_target
    )

    base_smart_savings = calculate_smart_savings(
        current_month_income=base_inc,
        average_income=base_inc,
        essential_expenses=base_essential,
        work_expenses=base_work,
        emi_amount=base_emi,
        current_savings=base_savings,
        emergency_target=base_emergency_target
    )

    # 2. Simulated State Calculation
    sim_inc = max(0.0, round(base_inc * (1 + income_change_pct / 100.0), 2))
    sim_exp = max(0.0, round(base_exp * (1 + expense_change_pct / 100.0) + vehicle_switch_cost_delta, 2))
    sim_emi = max(0.0, round(base_emi + new_monthly_emi, 2))
    sim_savings = max(0.0, round(base_savings - one_time_purchase_amount, 2))

    sim_health = calculate_financial_health(
        avg_income=sim_inc,
        stability_score=base_stability,
        total_expenses=sim_exp,
        essential_expenses=base_essential * (1 + expense_change_pct / 100.0),
        work_expenses=base_work + vehicle_switch_cost_delta,
        emi_amount=sim_emi,
        current_savings=sim_savings,
        emergency_target=base_emergency_target
    )

    sim_smart_savings = calculate_smart_savings(
        current_month_income=sim_inc,
        average_income=base_inc,
        essential_expenses=base_essential * (1 + expense_change_pct / 100.0),
        work_expenses=base_work + vehicle_switch_cost_delta,
        emi_amount=sim_emi,
        current_savings=sim_savings,
        emergency_target=base_emergency_target
    )

    surplus_before = max(0.0, base_inc - (base_essential + base_work + base_emi))
    surplus_after = max(0.0, sim_inc - ((base_essential * (1 + expense_change_pct / 100.0)) + base_work + vehicle_switch_cost_delta + sim_emi))

    return {
        "inputs": {
            "income_change_pct": income_change_pct,
            "expense_change_pct": expense_change_pct,
            "new_monthly_emi": new_monthly_emi,
            "one_time_purchase_amount": one_time_purchase_amount,
            "vehicle_switch_cost_delta": vehicle_switch_cost_delta
        },
        "before": {
            "income": base_inc,
            "expenses": base_exp,
            "emi": base_emi,
            "surplus": round(surplus_before, 2),
            "savings_recommendation": base_smart_savings["recommended_savings"],
            "health_score": base_health["score"],
            "health_grade": base_health["grade"]
        },
        "after": {
            "income": sim_inc,
            "expenses": sim_exp,
            "emi": sim_emi,
            "surplus": round(surplus_after, 2),
            "savings_recommendation": sim_smart_savings["recommended_savings"],
            "health_score": sim_health["score"],
            "health_grade": sim_health["grade"]
        },
        "deltas": {
            "surplus_delta": round(surplus_after - surplus_before, 2),
            "health_score_delta": sim_health["score"] - base_health["score"],
            "savings_recommendation_delta": round(sim_smart_savings["recommended_savings"] - base_smart_savings["recommended_savings"], 2)
        }
    }
