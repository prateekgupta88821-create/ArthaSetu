from .affordability_engine import calculate_affordability

def compare_gadgets(
    gadgets: list[dict],
    monthly_income: float,
    essential_expenses: float,
    work_expenses: float,
    existing_emi: float,
    current_savings: float
) -> dict:
    """
    Compares up to 3 gadgets side-by-side against user's actual financial profile.
    Each gadget dict: {"name": str, "category": str, "price": float, "down_payment": float, "tenure_months": int, "interest_rate": float}
    """
    results = []
    
    for g in gadgets[:3]:
        name = g.get("name", "Gadget")
        cat = g.get("category", "Smartphone")
        price = float(g.get("price", 0))
        dp = float(g.get("down_payment", 0))
        tenure = int(g.get("tenure_months", 12))
        rate = float(g.get("interest_rate", 12.0))

        aff = calculate_affordability(
            product_price=price,
            down_payment=dp,
            emi_months=tenure,
            annual_interest_rate=rate,
            monthly_income=monthly_income,
            essential_expenses=essential_expenses,
            work_expenses=work_expenses,
            existing_emi=existing_emi,
            current_savings=current_savings
        )

        results.append({
            "name": name,
            "category": cat,
            "price": price,
            "down_payment": dp,
            "tenure_months": tenure,
            "monthly_emi": aff["monthly_emi"],
            "total_financing_cost": aff["total_financing_cost"],
            "post_purchase_buffer": aff["post_purchase_buffer"],
            "affordability_category": aff["affordability_category"],
            "badge_color": aff["badge_color"],
            "impact_summary": aff["buffer_impact_statement"]
        })

    # Recommended budget range based on monthly surplus
    current_surplus = max(0.0, monthly_income - (essential_expenses + work_expenses + existing_emi))
    safe_max_emi = current_surplus * 0.25
    recommended_max_price = safe_max_emi * 12

    lower_range = max(10000.0, round(recommended_max_price * 0.6, -3))
    upper_range = round(max(15000.0, recommended_max_price), -3)

    return {
        "gadget_comparisons": results,
        "current_monthly_surplus": round(current_surplus, 2),
        "recommended_budget_range": {
            "min_price": lower_range,
            "max_price": upper_range,
            "explanation": f"Based on your surplus of ₹{int(current_surplus):,}/month, a gadget priced between ₹{int(lower_range):,} and ₹{int(upper_range):,} keeps your budget safe."
        }
    }
