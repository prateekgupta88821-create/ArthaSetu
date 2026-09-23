import math

def calculate_vehicle_cost(
    vehicle_type: str,            # "Motorcycle", "Scooter", "EV Scooter", "Car"
    vehicle_price: float,
    down_payment: float,
    loan_months: int,
    interest_rate: float,
    daily_distance_km: float,
    working_days_per_month: int,
    mileage_per_unit: float,      # km per liter or km per kWh
    energy_unit_price: float,     # ₹ per liter or ₹ per kWh
    monthly_insurance: float,
    monthly_maintenance: float,
    monthly_other_costs: float = 0.0
) -> dict:
    """
    Calculates monthly & annual total cost of ownership (TCO) and cost/km for gig workers.
    """
    price = max(0.0, float(vehicle_price))
    dp = max(0.0, min(price, float(down_payment)))
    principal = price - dp
    n = max(1, int(loan_months))
    r = (float(interest_rate) / 12.0) / 100.0

    if principal <= 0:
        monthly_emi = 0.0
    elif r == 0:
        monthly_emi = principal / n
    else:
        monthly_emi = principal * (r * math.pow(1 + r, n)) / (math.pow(1 + r, n) - 1)
    
    monthly_emi = round(monthly_emi, 2)

    # Distance calculation
    daily_km = max(0.0, float(daily_distance_km))
    work_days = max(1, int(working_days_per_month))
    monthly_distance = daily_km * work_days

    # Fuel / Energy calculation
    mileage = max(1.0, float(mileage_per_unit))
    unit_cost = max(0.0, float(energy_unit_price))
    
    units_consumed = (monthly_distance / mileage) if monthly_distance > 0 else 0.0
    monthly_fuel_cost = round(units_consumed * unit_cost, 2)

    ins = max(0.0, float(monthly_insurance))
    maint = max(0.0, float(monthly_maintenance))
    other = max(0.0, float(monthly_other_costs))

    total_monthly_cost = round(monthly_emi + monthly_fuel_cost + maint + ins + other, 2)
    annual_cost = round(total_monthly_cost * 12.0, 2)

    cost_per_km = round((total_monthly_cost / monthly_distance) if monthly_distance > 0 else 0.0, 2)

    return {
        "vehicle_type": vehicle_type,
        "vehicle_price": price,
        "down_payment": dp,
        "loan_months": n,
        "monthly_emi": monthly_emi,
        "monthly_distance_km": round(monthly_distance, 1),
        "monthly_fuel_cost": monthly_fuel_cost,
        "monthly_maintenance": maint,
        "monthly_insurance": ins,
        "monthly_other_costs": other,
        "total_monthly_cost": total_monthly_cost,
        "annual_ownership_cost": annual_cost,
        "cost_per_km": cost_per_km
    }

def compare_petrol_vs_ev(
    daily_km: float = 75.0,
    work_days: int = 26,
    petrol_price: float = 100.0,
    elec_price: float = 8.0,
    monthly_income: float = 30000.0
) -> dict:
    """
    Direct comparative matrix for Petrol Scooter vs EV Scooter for a delivery worker.
    """
    petrol_scooter = calculate_vehicle_cost(
        vehicle_type="Petrol Scooter",
        vehicle_price=85000,
        down_payment=15000,
        loan_months=24,
        interest_rate=11.5,
        daily_distance_km=daily_km,
        working_days_per_month=work_days,
        mileage_per_unit=45.0,        # 45 km/l
        energy_unit_price=petrol_price,
        monthly_insurance=350,
        monthly_maintenance=800,
        monthly_other_costs=200
    )

    ev_scooter = calculate_vehicle_cost(
        vehicle_type="EV Scooter",
        vehicle_price=110000,
        down_payment=20000,
        loan_months=24,
        interest_rate=11.5,
        daily_distance_km=daily_km,
        working_days_per_month=work_days,
        mileage_per_unit=30.0,        # 30 km/kWh
        energy_unit_price=elec_price,  # ₹8/kWh
        monthly_insurance=400,
        monthly_maintenance=350,       # Lower EV maintenance
        monthly_other_costs=200
    )

    monthly_savings = round(petrol_scooter["total_monthly_cost"] - ev_scooter["total_monthly_cost"], 2)
    three_year_savings = round(monthly_savings * 36, 2)

    return {
        "petrol_scooter": petrol_scooter,
        "ev_scooter": ev_scooter,
        "monthly_ev_savings": monthly_savings,
        "three_year_ev_savings": three_year_savings,
        "recommendation": f"For {int(daily_km)}km daily usage, EV Scooter saves ₹{int(monthly_savings):,}/month in fuel and maintenance (₹{int(three_year_savings):,} over 3 years)."
    }
