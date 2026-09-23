import statistics

def generate_cashflow_forecast(
    historical_incomes: list[float],
    historical_expenses: list[float],
    avg_income: float,
    avg_expense: float
) -> dict:
    """
    Generates 7-day, 30-day, and 90-day cash flow forecasts with uncertainty bands.
    """
    clean_inc = [float(x) for x in historical_incomes if x is not None and x > 0]
    clean_exp = [float(x) for x in historical_expenses if x is not None and x > 0]

    inc_avg = avg_income if avg_income > 0 else (statistics.mean(clean_inc) if clean_inc else 30000.0)
    exp_avg = avg_expense if avg_expense > 0 else (statistics.mean(clean_exp) if clean_exp else 18000.0)

    # Calculate std dev for uncertainty range
    inc_std = statistics.stdev(clean_inc) if len(clean_inc) > 1 else (inc_avg * 0.15)
    exp_std = statistics.stdev(clean_exp) if len(clean_exp) > 1 else (exp_avg * 0.08)

    # Daily baseline
    daily_inc = inc_avg / 30.0
    daily_exp = exp_avg / 30.0

    forecasts = {}

    for period_days, label in [(7, "7-Day"), (30, "30-Day"), (90, "90-Day")]:
        mult = period_days / 30.0
        exp_inc = inc_avg * mult
        exp_exp = exp_avg * mult

        inc_min = max(0.0, exp_inc - (inc_std * mult * 0.8))
        inc_max = exp_inc + (inc_std * mult * 0.8)

        exp_min = max(0.0, exp_exp - (exp_std * mult * 0.5))
        exp_max = exp_exp + (exp_std * mult * 0.5)

        surplus_expected = exp_inc - exp_exp
        surplus_min = inc_min - exp_max
        surplus_max = inc_max - exp_min

        forecasts[label] = {
            "period_days": period_days,
            "expected_income": round(exp_inc, 2),
            "income_range": [round(inc_min, 2), round(inc_max, 2)],
            "expected_expenses": round(exp_exp, 2),
            "expense_range": [round(exp_min, 2), round(exp_max, 2)],
            "expected_surplus": round(surplus_expected, 2),
            "surplus_range": [round(surplus_min, 2), round(surplus_max, 2)],
            "confidence": "High" if len(clean_inc) >= 5 else "Medium"
        }

    return {
        "daily_income_avg": round(daily_inc, 2),
        "daily_expense_avg": round(daily_exp, 2),
        "forecasts": forecasts
    }
