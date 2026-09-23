def calculate_financial_health(
    avg_income: float,
    stability_score: float,
    total_expenses: float,
    essential_expenses: float,
    work_expenses: float,
    emi_amount: float,
    current_savings: float,
    emergency_target: float,
    discretionary_expenses: float = 0.0,
    goal_completion_pct: float = 0.0
) -> dict:
    """
    Computes a deterministic financial health score (0-100) and actionable diagnosis.
    Disclaimer: Educational indicator, not an official credit or regulated rating.
    """
    if avg_income <= 0:
        return {
            "score": 0,
            "grade": "Needs Attention",
            "what_is_good": [],
            "needs_attention": ["Income profile missing or zero."],
            "what_changed": "No financial history recorded.",
            "action_recommendations": ["Complete onboarding with valid income data."]
        }

    # 1. Income Stability Component (20 points max)
    stability_pts = (stability_score / 100.0) * 20.0

    # 2. Expense & Surplus Component (25 points max)
    surplus = avg_income - total_expenses
    surplus_pct = (surplus / avg_income) * 100.0
    if surplus_pct >= 30:
        surplus_pts = 25.0
    elif surplus_pct >= 15:
        surplus_pts = 18.0
    elif surplus_pct >= 5:
        surplus_pts = 10.0
    elif surplus_pct >= 0:
        surplus_pts = 5.0
    else:
        surplus_pts = 0.0

    # 3. Emergency Reserve Component (25 points max)
    monthly_essential = essential_expenses if essential_expenses > 0 else (avg_income * 0.5)
    months_covered = (current_savings / monthly_essential) if monthly_essential > 0 else 0.0
    if months_covered >= 6.0:
        emergency_pts = 25.0
    elif months_covered >= 3.0:
        emergency_pts = 20.0
    elif months_covered >= 1.0:
        emergency_pts = 12.0
    elif months_covered > 0:
        emergency_pts = 5.0
    else:
        emergency_pts = 0.0

    # 4. EMI & Debt Burden Component (20 points max)
    emi_ratio = (emi_amount / avg_income) * 100.0 if avg_income > 0 else 0.0
    if emi_ratio == 0:
        emi_pts = 20.0
    elif emi_ratio <= 15.0:
        emi_pts = 18.0
    elif emi_ratio <= 30.0:
        emi_pts = 12.0
    elif emi_ratio <= 45.0:
        emi_pts = 5.0
    else:
        emi_pts = 0.0

    # 5. Goal & Discretionary Control (10 points max)
    disc_ratio = (discretionary_expenses / avg_income * 100.0) if avg_income > 0 else 0.0
    disc_pts = 5.0 if disc_ratio <= 20.0 else (2.0 if disc_ratio <= 35.0 else 0.0)
    goal_pts = min(5.0, (goal_completion_pct / 100.0) * 5.0)

    total_score = round(stability_pts + surplus_pts + emergency_pts + emi_pts + disc_pts + goal_pts)
    total_score = max(0, min(100, total_score))

    # Grade determination
    if total_score >= 80:
        grade = "Excellent"
    elif total_score >= 65:
        grade = "Good"
    elif total_score >= 50:
        grade = "Fair"
    elif total_score >= 35:
        grade = "Needs Attention"
    else:
        grade = "High Risk"

    what_is_good = []
    needs_attention = []
    action_recommendations = []

    if months_covered >= 3.0:
        what_is_good.append(f"Emergency reserve covers {round(months_covered, 1)} months of essential living expenses.")
    else:
        needs_attention.append(f"Emergency fund covers only {round(months_covered, 1)} months (recommended minimum: 3–6 months).")
        action_recommendations.append("Direct 50% of available monthly surplus to building emergency cash reserves.")

    if emi_ratio <= 20.0:
        what_is_good.append(f"Debt burden is manageable at {round(emi_ratio, 1)}% of income.")
    else:
        needs_attention.append(f"EMI debt ratio is elevated at {round(emi_ratio, 1)}% of average monthly earnings.")
        action_recommendations.append("Avoid taking on new loans or purchase EMIs until debt ratio falls below 25%.")

    if stability_score >= 70:
        what_is_good.append(f"Income stability score is strong ({round(stability_score)}/100).")
    else:
        needs_attention.append(f"Income fluctuates considerably month-to-month (Stability: {round(stability_score)}/100).")
        action_recommendations.append("Build a liquid income-smoothing buffer equal to 1 typical low-income month gap.")

    if surplus > 0:
        what_is_good.append(f"Net positive monthly surplus of ₹{int(surplus):,} available for savings & goals.")
    else:
        needs_attention.append("Monthly expenses equal or exceed earnings, leaving zero savings buffer.")
        action_recommendations.append("Audit discretionary spending and optimize work expenses like fuel efficiency.")

    what_changed = "Calculated using your latest income records, expense categorization, and savings balances."

    return {
        "score": total_score,
        "grade": grade,
        "breakdown": {
            "income_stability_pts": round(stability_pts, 1),
            "surplus_pts": round(surplus_pts, 1),
            "emergency_pts": round(emergency_pts, 1),
            "emi_pts": round(emi_pts, 1),
            "discipline_pts": round(disc_pts + goal_pts, 1)
        },
        "metrics": {
            "months_covered": round(months_covered, 1),
            "emi_ratio_pct": round(emi_ratio, 1),
            "surplus_pct": round(surplus_pct, 1)
        },
        "what_is_good": what_is_good,
        "needs_attention": needs_attention,
        "what_changed": what_changed,
        "action_recommendations": action_recommendations
    }
