import math

def calculate_affordability(
    product_price: float,
    down_payment: float,
    emi_months: int,
    annual_interest_rate: float,
    monthly_income: float,
    essential_expenses: float,
    work_expenses: float,
    existing_emi: float,
    current_savings: float
) -> dict:
    """
    Universal 'Can I Afford It?' calculation engine.
    Calculates EMI, buffer reduction, risk rating, and alternatives.
    """
    price = max(0.0, float(product_price))
    dp = max(0.0, min(price, float(down_payment)))
    principal = price - dp
    n = max(1, int(emi_months))
    rate_annual = max(0.0, float(annual_interest_rate))

    # Monthly interest rate
    r = (rate_annual / 12.0) / 100.0

    if principal <= 0:
        monthly_emi = 0.0
        total_interest = 0.0
    elif r == 0:
        monthly_emi = principal / n
        total_interest = 0.0
    else:
        monthly_emi = principal * (r * math.pow(1 + r, n)) / (math.pow(1 + r, n) - 1)
        total_interest = (monthly_emi * n) - principal

    monthly_emi = round(monthly_emi, 2)
    total_financing_cost = round(principal + total_interest, 2)

    # Surplus calculations
    current_fixed_obligations = essential_expenses + work_expenses + existing_emi
    current_buffer = max(0.0, monthly_income - current_fixed_obligations)
    new_buffer = current_buffer - monthly_emi
    total_new_emi = existing_emi + monthly_emi

    emi_income_ratio = (total_new_emi / monthly_income * 100.0) if monthly_income > 0 else 100.0
    buffer_ratio = (new_buffer / monthly_income * 100.0) if monthly_income > 0 else 0.0

    # Categorization rules
    if new_buffer <= 0 or emi_income_ratio > 40.0:
        category = "Financially Stretching"
        color = "red"
        description = "This purchase would severely strain your monthly finances and risk creating a budget deficit."
    elif emi_income_ratio > 25.0 or buffer_ratio < 10.0:
        category = "High Pressure"
        color = "amber"
        description = "This EMI places substantial pressure on your monthly surplus, leaving little safety margin."
    elif emi_income_ratio > 15.0 or buffer_ratio < 20.0:
        category = "Moderate Pressure"
        color = "yellow"
        description = "This purchase is manageable but reduces your monthly flexible buffer noticeably."
    else:
        category = "Manageable"
        color = "emerald"
        description = "This purchase fits comfortably within your monthly budget buffer without overleveraging."

    # Smart Recommendations
    recommended_dp = max(dp, round(price * 0.40, 2))
    recommended_budget_max = round(current_buffer * 0.20 * n, 2) if n > 0 else price

    buffer_impact_statement = f"At your current income and obligations, this purchase will reduce your estimated monthly buffer by ₹{int(monthly_emi):,} (from ₹{int(current_buffer):,} down to ₹{int(max(0, new_buffer)):,})."

    return {
        "product_price": price,
        "down_payment": dp,
        "principal_financed": principal,
        "emi_months": n,
        "annual_interest_rate": rate_annual,
        "monthly_emi": monthly_emi,
        "total_interest": round(total_interest, 2),
        "total_financing_cost": total_financing_cost,
        "current_monthly_buffer": round(current_buffer, 2),
        "post_purchase_buffer": round(new_buffer, 2),
        "total_emi_burden_pct": round(emi_income_ratio, 1),
        "affordability_category": category,
        "badge_color": color,
        "description": description,
        "buffer_impact_statement": buffer_impact_statement,
        "recommendations": {
            "suggested_higher_down_payment": recommended_dp if dp < recommended_dp else None,
            "recommended_max_gadget_price": min(price, max(10000, recommended_budget_max)),
            "delay_purchase_months": 3 if category in ["High Pressure", "Financially Stretching"] else 0
        }
    }
