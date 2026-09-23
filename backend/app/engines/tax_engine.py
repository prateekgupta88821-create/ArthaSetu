TAX_DISCLAIMER = "For organization and educational purposes only. Verify tax requirements with an eligible professional or official tax authority."

def generate_tax_summary(
    monthly_income: float,
    expenses: list[dict],
    occupation: str = "Delivery Partner"
) -> dict:
    """
    Summarizes income and eligible work-related expense deductions for gig worker tax organization.
    """
    annual_gross_income = round(monthly_income * 12.0, 2)
    
    work_deductible_items = []
    total_work_deductions = 0.0

    for exp in expenses:
        cat = exp.get("category", "")
        amt = float(exp.get("amount", 0))
        # Work related categories
        if cat in ["Fuel", "Vehicle Maintenance", "Mobile/Data", "Platform Fees", "Work Equipment"]:
            annual_amt = round(amt * 12.0, 2)
            work_deductible_items.append({
                "title": exp.get("title", cat),
                "category": cat,
                "monthly_amount": amt,
                "annual_deductible": annual_amt,
                "deductible_reason": f"Necessary operational cost for {occupation}"
            })
            total_work_deductions += annual_amt

    net_taxable_estimate = max(0.0, annual_gross_income - total_work_deductions)

    checklist = [
        "Maintain digital receipts for all fuel and vehicle maintenance logs.",
        "Keep mobile data bills separate to claim work usage proportion.",
        "Track platform commission fees deducted directly from payouts.",
        "Review Section 80C options (PPF, ELSS, Insurance) for potential savings.",
        "Check advance tax deadlines (15th Jun, 15th Sep, 15th Dec, 15th Mar) if annual tax liability exceeds ₹10,000."
    ]

    return {
        "occupation": occupation,
        "annual_gross_income_estimate": annual_gross_income,
        "total_annual_work_deductions": round(total_work_deductions, 2),
        "estimated_net_taxable_base": round(net_taxable_estimate, 2),
        "deductible_expenses_breakdown": work_deductible_items,
        "tax_checklist": checklist,
        "disclaimer": TAX_DISCLAIMER
    }
