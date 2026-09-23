def calculate_smart_savings(
    current_month_income: float,
    average_income: float,
    essential_expenses: float,
    work_expenses: float,
    emi_amount: float,
    current_savings: float,
    emergency_target: float,
    active_goals: list[dict] = None
) -> dict:
    """
    Adaptive Smart Savings Recommendation Engine.
    Dynamically adjusts recommended savings based on income fluctuations.
    """
    if active_goals is None:
        active_goals = []

    income = float(current_month_income if current_month_income > 0 else average_income)
    essential = float(essential_expenses)
    work = float(work_expenses)
    emi = float(emi_amount)

    fixed_obligations = essential + work + emi
    surplus = max(0.0, income - fixed_obligations)

    is_low_income_month = income < (average_income * 0.9) if average_income > 0 else False
    is_high_income_month = income > (average_income * 1.1) if average_income > 0 else False

    emergency_gap = max(0.0, emergency_target - current_savings)
    emergency_needed = emergency_gap > 0

    if surplus <= 0:
        return {
            "income": income,
            "fixed_obligations": fixed_obligations,
            "surplus": 0.0,
            "recommended_savings": 0.0,
            "allocations": {
                "emergency_fund": 0.0,
                "goals": 0.0,
                "flexible_buffer": 0.0
            },
            "explanation": "In tight or low-income months, your primary priority is protecting essential living and work expenses. No savings recommended this month."
        }

    # Savings ratio adjustment based on income state
    if is_low_income_month:
        savings_ratio = 0.40  # Save less (40% of surplus), hold 60% buffer
        note = "Low-income month detected: Savings target reduced to protect your monthly living buffer."
    elif is_high_income_month:
        savings_ratio = 0.75  # Save more (75% of surplus) to capture upside
        note = "High-income month detected! Recommending higher savings allocation to build your financial reserve."
    else:
        savings_ratio = 0.60  # Balanced state
        note = "Typical income month: Balanced savings allocation applied."

    total_recommended = round(surplus * savings_ratio, 2)

    # Sub-allocation breakdown
    if emergency_needed:
        # Priority to Emergency Reserve (60% of savings, 30% goals, 10% buffer)
        emergency_alloc = round(total_recommended * 0.60, 2)
        goals_alloc = round(total_recommended * 0.30, 2)
        buffer_alloc = round(surplus - total_recommended, 2)
    else:
        # Emergency reserve full -> Priority to Goals (70% goals, 30% emergency top-up/invest)
        emergency_alloc = round(total_recommended * 0.20, 2)
        goals_alloc = round(total_recommended * 0.80, 2)
        buffer_alloc = round(surplus - total_recommended, 2)

    return {
        "income": round(income, 2),
        "essential_expenses": round(essential, 2),
        "work_expenses": round(work, 2),
        "emi_amount": round(emi, 2),
        "fixed_obligations": round(fixed_obligations, 2),
        "surplus": round(surplus, 2),
        "recommended_savings": total_recommended,
        "savings_rate_pct": round((total_recommended / income * 100) if income > 0 else 0, 1),
        "allocations": {
            "emergency_fund": emergency_alloc,
            "goals": goals_alloc,
            "flexible_buffer": max(0.0, buffer_alloc)
        },
        "is_low_income_month": is_low_income_month,
        "is_high_income_month": is_high_income_month,
        "explanation": note
    }
