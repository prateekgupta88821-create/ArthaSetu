import os

SYSTEM_COPILOT_PROMPT = """You are GigWealth AI Copilot, a friendly, intelligent financial advisor designed specifically for gig workers (delivery partners, ride-hailing drivers, freelancers, independent contractors).

Tagline: Earn Irregularly. Plan Intelligently. Spend Confidently.

CRITICAL INSTRUCTIONS:
1. ALWAYS use the user's EXACT financial metrics provided in the context below. NEVER invent, fabricate, or recalculate numbers.
2. Keep advice practical, supportive, and conservative.
3. Prioritize Emergency Fund reserves and Essential Expenses over high-risk investments or discretionary purchases.
4. Always disclaim that recommendations are educational financial guidance, not regulated personal investment advice.
"""

def answer_copilot_question(question: str, financial_context: dict) -> dict:
    """
    Answers user financial copilot questions using grounded pre-calculated metrics.
    Attempts Gemini API if key is present; falls back seamlessly to deterministic natural language reasoning engine.
    """
    q_lower = question.lower().strip()

    avg_inc = financial_context.get("average_income", 30000.0)
    typical_range = financial_context.get("typical_range", [26000.0, 34000.0])
    essential = financial_context.get("essential_expenses", 16000.0)
    work = financial_context.get("work_expenses", 4000.0)
    emi = financial_context.get("emi_amount", 2000.0)
    savings = financial_context.get("current_savings", 18000.0)
    emergency_target = financial_context.get("emergency_target", 30000.0)
    rec_savings = financial_context.get("recommended_savings", 4800.0)
    health_score = financial_context.get("health_score", 72)
    health_grade = financial_context.get("health_grade", "Good")

    fixed_obs = essential + work + emi
    surplus = max(0.0, avg_inc - fixed_obs)
    months_covered = round(savings / essential, 1) if essential > 0 else 0.0

    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"{SYSTEM_COPILOT_PROMPT}\n\nUSER FINANCIAL CONTEXT:\n{financial_context}\n\nUSER QUESTION: {question}\n\nProvide a concise, helpful answer grounded strictly in these figures."
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            if response and response.text:
                return {
                    "question": question,
                    "answer": response.text.strip(),
                    "source": "Gemini AI (Grounded)"
                }
        except Exception:
            pass  # Fall back to offline deterministic intelligence

    # Offline Intelligent Grounded Engine
    if "save" in q_lower or "how much should i save" in q_lower or "savings recommendation" in q_lower:
        if months_covered < 3.0:
            ans = f"Based on your average monthly income of ₹{int(avg_inc):,} and fixed obligations of ₹{int(fixed_obs):,}, your monthly surplus is ₹{int(surplus):,}. We recommend saving **₹{int(rec_savings):,}** this month. Since your current savings (₹{int(savings):,}) cover only {months_covered} months of essential living expenses, we strongly suggest directing 60% of this savings into your Emergency Reserve target (₹{int(emergency_target):,})."
        else:
            ans = f"Your financial health is currently **{health_grade}** (Score: {health_score}/100). We recommend saving **₹{int(rec_savings):,}** this month out of your ₹{int(surplus):,} net surplus. Because your emergency reserve is secured ({months_covered} months covered), you can allocate 80% towards your active goal targets!"

    elif "afford" in q_lower or "phone" in q_lower or "gadget" in q_lower:
        safe_emi_limit = round(surplus * 0.25, 2)
        safe_price_limit = round(safe_emi_limit * 12, 2)
        ans = f"At your current monthly income (₹{int(avg_inc):,}) and existing obligations (₹{int(fixed_obs):,}), your comfortable monthly surplus is ₹{int(surplus):,}.\n\n- **Safe Monthly EMI Limit**: Up to ₹{int(safe_emi_limit):,}/month.\n- **Recommended Gadget Price Range**: Under ₹{int(safe_price_limit):,}.\n\nIf you buy a phone priced above ₹{int(safe_price_limit):,}, it will place high pressure on your monthly budget buffer. We recommend considering devices in the ₹18,000–₹25,000 range to keep your emergency fund safe."

    elif "vehicle" in q_lower or "ev" in q_lower or "scooter" in q_lower or "fuel" in q_lower:
        ans = f"Your work expenses are currently **₹{int(work):,}/month**, with fuel and maintenance being significant factors. If you drive over 60km/day as a delivery partner, switching from a Petrol Scooter to an **EV Scooter** can save you approximately **₹1,200 to ₹1,800 every month** in running costs, paying back the vehicle cost difference within 24 months."

    elif "income" in q_lower or "average" in q_lower or "range" in q_lower:
        ans = f"Your average monthly income is **₹{int(avg_inc):,}**, with a typical monthly variation range of **₹{int(typical_range[0]):,} to ₹{int(typical_range[1]):,}**. Because gig earnings fluctuate, our smart savings engine dynamically adjusts recommendations based on whether you're having a high-earning or lean month."

    elif "essential" in q_lower or "expense" in q_lower or "spending" in q_lower:
        ans = f"Your total monthly expenses are **₹{int(fixed_obs):,}**:\n- Essential living expenses (rent, food, healthcare): ₹{int(essential):,}\n- Work-related expenses (fuel, maintenance, data): ₹{int(work):,}\n- Existing monthly EMIs: ₹{int(emi):,}\n\nYour essential expenses are protected first before any savings or goal allocations are calculated."

    elif "invest" in q_lower or "investing" in q_lower:
        if months_covered < 3.0:
            ans = f"**Emergency Reserve First!** Your current savings (₹{int(savings):,}) cover only {months_covered} months of essential expenses. We advise strengthening your emergency buffer to at least 3–6 months (₹{int(emergency_target):,}) in liquid savings before exploring conservative investment instruments like Recurring Deposits (RD) or Fixed Deposits (FD)."
        else:
            ans = f"Your emergency reserve is healthy at {months_covered} months! You can explore conservative, liquid investment options such as Bank Fixed Deposits (FD), Recurring Deposits (RD), or Government Savings schemes. Avoid high-volatility products that require locked-in capital when managing irregular gig income."

    else:
        ans = f"Based on your profile as a gig worker earning an average of ₹{int(avg_inc):,}/month with a net monthly surplus of ₹{int(surplus):,}:\n- **Financial Health Score**: {health_score}/100 ({health_grade})\n- **Recommended Savings**: ₹{int(rec_savings):,}/month\n- **Emergency Reserve Status**: {months_covered} months covered (₹{int(savings):,})\n\nYou can ask me specific questions like *'Can I afford a new phone?'*, *'How much should I save?'*, or *'Should I switch to an EV?'*"

    return {
        "question": question,
        "answer": ans,
        "source": "GigWealth Deterministic Financial Intelligence"
    }
