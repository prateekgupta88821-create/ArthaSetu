CATEGORY_GROUPS = {
    "Essential": ["Rent", "Food", "Utilities", "Transportation", "Education", "Healthcare"],
    "Work": ["Fuel", "Vehicle Maintenance", "Mobile/Data", "Platform Fees", "Work Equipment"],
    "Financial": ["EMI", "Loan", "Insurance"],
    "Discretionary": ["Shopping", "Entertainment", "Dining", "Subscriptions", "Other"]
}

def analyze_expenses(expenses: list[dict], average_income: float = 0.0) -> dict:
    """
    Analyzes list of expense items:
    Each expense dict: {"title": str, "amount": float, "category": str, "group": str (optional)}
    """
    essential_sum = 0.0
    work_sum = 0.0
    financial_sum = 0.0
    discretionary_sum = 0.0

    category_breakdown = {}

    for item in expenses:
        amt = float(item.get("amount", 0.0))
        cat = item.get("category", "Other")
        grp = item.get("group", "")

        category_breakdown[cat] = category_breakdown.get(cat, 0.0) + amt

        if grp == "Essential" or cat in CATEGORY_GROUPS["Essential"]:
            essential_sum += amt
        elif grp == "Work" or cat in CATEGORY_GROUPS["Work"]:
            work_sum += amt
        elif grp == "Financial" or cat in CATEGORY_GROUPS["Financial"]:
            financial_sum += amt
        else:
            discretionary_sum += amt

    total_expenses = essential_sum + work_sum + financial_sum + discretionary_sum

    # Needs vs Wants (Needs = Essential + Work + Financial obligations; Wants = Discretionary)
    needs_sum = essential_sum + work_sum + financial_sum
    wants_sum = discretionary_sum

    expense_ratio = (total_expenses / average_income * 100) if average_income > 0 else 0.0

    return {
        "total_expenses": round(total_expenses, 2),
        "essential_expenses": round(essential_sum, 2),
        "work_expenses": round(work_sum, 2),
        "financial_expenses": round(financial_sum, 2),
        "discretionary_expenses": round(discretionary_sum, 2),
        "needs_total": round(needs_sum, 2),
        "wants_total": round(wants_sum, 2),
        "needs_vs_wants_ratio": {
            "needs_percentage": round((needs_sum / total_expenses * 100) if total_expenses > 0 else 100, 1),
            "wants_percentage": round((wants_sum / total_expenses * 100) if total_expenses > 0 else 0, 1),
        },
        "category_breakdown": {k: round(v, 2) for k, v in category_breakdown.items()},
        "expense_ratio_pct": round(expense_ratio, 1)
    }
