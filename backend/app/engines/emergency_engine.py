def calculate_emergency_fund(
    essential_monthly_expenses: float,
    current_savings: float,
    target_months: int = 6,
    monthly_contribution: float = 3000.0
) -> dict:
    """
    Calculates emergency fund target, progress, and months to completion.
    Supported target_months: 3, 6, or 9 months.
    """
    if target_months not in [3, 6, 9]:
        target_months = 6

    monthly_req = max(1000.0, float(essential_monthly_expenses))
    target_amount = round(monthly_req * target_months, 2)
    current = max(0.0, float(current_savings))

    remaining = max(0.0, round(target_amount - current, 2))
    progress_pct = min(100.0, round((current / target_amount * 100) if target_amount > 0 else 0, 1))

    if remaining == 0:
        months_to_target = 0
    elif monthly_contribution > 0:
        months_to_target = max(1, round(remaining / monthly_contribution))
    else:
        months_to_target = 999  # Indefinite if no monthly contribution

    status = "Secured" if progress_pct >= 100 else ("In Progress" if progress_pct >= 40 else "Needs Priority")

    return {
        "essential_monthly_expenses": monthly_req,
        "target_months": target_months,
        "target_amount": target_amount,
        "current_savings": current,
        "remaining_amount": remaining,
        "progress_pct": progress_pct,
        "estimated_months_to_target": months_to_target,
        "status": status
    }
