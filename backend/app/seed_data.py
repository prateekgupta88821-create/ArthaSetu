PERSONAS = {
    "rahul": {
        "id": 1,
        "name": "Rahul",
        "occupation": "Delivery Partner",
        "income_source": "Zomato & Swiggy Delivery",
        "risk_preference": "Conservative",
        "profile": {
            "average_daily_income": 1000.0,
            "average_monthly_income": 30000.0,
            "income_frequency": "Daily",
            "essential_expenses": 16000.0,
            "work_expenses": 4000.0,
            "existing_emi": 2000.0,
            "current_savings": 18000.0,
            "emergency_target": 30000.0,
            "emergency_months": 6,
            "stability_score": 76.5
        },
        "income_history": [28500, 31200, 25800, 29400, 27900, 34000],
        "expenses": [
            {"title": "House Rent", "category": "Rent", "group": "Essential", "amount": 9000.0, "date": "2026-09-01"},
            {"title": "Groceries & Household", "category": "Food", "group": "Essential", "amount": 5000.0, "date": "2026-09-03"},
            {"title": "Electricity & Water", "category": "Utilities", "group": "Essential", "amount": 2000.0, "date": "2026-09-05"},
            {"title": "Bike Petrol / Fuel", "category": "Fuel", "group": "Work", "amount": 2800.0, "date": "2026-09-07"},
            {"title": "Bike Service & Engine Oil", "category": "Vehicle Maintenance", "group": "Work", "amount": 700.0, "date": "2026-09-10"},
            {"title": "Mobile Data Unlimited Pack", "category": "Mobile/Data", "group": "Work", "amount": 500.0, "date": "2026-09-12"},
            {"title": "Personal Phone Loan EMI", "category": "EMI", "group": "Financial", "amount": 2000.0, "date": "2026-09-15"},
            {"title": "Weekend Dining & Snacks", "category": "Dining", "group": "Discretionary", "amount": 1500.0, "date": "2026-09-18"}
        ],
        "goals": [
            {"name": "Emergency Reserve", "target_amount": 30000.0, "current_amount": 18000.0, "deadline": "2026-12-31", "category": "Emergency"},
            {"name": "New Delivery EV Scooter", "target_amount": 110000.0, "current_amount": 12000.0, "deadline": "2027-06-30", "category": "Vehicle"}
        ]
    },
    "stable_worker": {
        "id": 2,
        "name": "Priya Sharma",
        "occupation": "Freelance UI Designer",
        "income_source": "Retainer Client Projects",
        "risk_preference": "Moderate",
        "profile": {
            "average_daily_income": 1200.0,
            "average_monthly_income": 35000.0,
            "income_frequency": "Monthly",
            "essential_expenses": 17000.0,
            "work_expenses": 3000.0,
            "existing_emi": 1500.0,
            "current_savings": 45000.0,
            "emergency_target": 40000.0,
            "emergency_months": 6,
            "stability_score": 88.0
        },
        "income_history": [34000, 36000, 35000, 34500, 35500, 36500],
        "expenses": [
            {"title": "Apartment Rent", "category": "Rent", "group": "Essential", "amount": 10000.0, "date": "2026-09-01"},
            {"title": "Groceries", "category": "Food", "group": "Essential", "amount": 5000.0, "date": "2026-09-02"},
            {"title": "Utilities & Wifi", "category": "Utilities", "group": "Essential", "amount": 2000.0, "date": "2026-09-04"},
            {"title": "Figma & Adobe Subscriptions", "category": "Work Equipment", "group": "Work", "amount": 2500.0, "date": "2026-09-06"},
            {"title": "Co-working Pass", "category": "Mobile/Data", "group": "Work", "amount": 500.0, "date": "2026-09-08"},
            {"title": "Laptop Loan EMI", "category": "EMI", "group": "Financial", "amount": 1500.0, "date": "2026-09-12"},
            {"title": "Weekend Outings", "category": "Dining", "group": "Discretionary", "amount": 2000.0, "date": "2026-09-15"}
        ],
        "goals": [
            {"name": "MacBook Pro Upgrade", "target_amount": 140000.0, "current_amount": 35000.0, "deadline": "2027-03-31", "category": "Gadget"}
        ]
    },
    "irregular_worker": {
        "id": 3,
        "name": "Amit Kumar",
        "occupation": "Ride-Hailing Driver",
        "income_source": "Uber & Rapido Rides",
        "risk_preference": "Conservative",
        "profile": {
            "average_daily_income": 950.0,
            "average_monthly_income": 28000.0,
            "income_frequency": "Daily",
            "essential_expenses": 15000.0,
            "work_expenses": 6500.0,
            "existing_emi": 3500.0,
            "current_savings": 8000.0,
            "emergency_target": 35000.0,
            "emergency_months": 6,
            "stability_score": 45.0
        },
        "income_history": [20000, 38000, 22000, 40000, 21000, 36000],
        "expenses": [
            {"title": "House Rent", "category": "Rent", "group": "Essential", "amount": 8500.0, "date": "2026-09-01"},
            {"title": "Food & Groceries", "category": "Food", "group": "Essential", "amount": 4500.0, "date": "2026-09-03"},
            {"title": "Utilities", "category": "Utilities", "group": "Essential", "amount": 2000.0, "date": "2026-09-05"},
            {"title": "Cab CNG Fuel", "category": "Fuel", "group": "Work", "amount": 5000.0, "date": "2026-09-07"},
            {"title": "Car Maintenance", "category": "Vehicle Maintenance", "group": "Work", "amount": 1500.0, "date": "2026-09-10"},
            {"title": "Car Loan EMI", "category": "EMI", "group": "Financial", "amount": 3500.0, "date": "2026-09-15"}
        ],
        "goals": [
            {"name": "Emergency Reserve Gap", "target_amount": 35000.0, "current_amount": 8000.0, "deadline": "2027-01-31", "category": "Emergency"}
        ]
    },
    "new_worker": {
        "id": 4,
        "name": "Karan Singh",
        "occupation": "New Independent Courier",
        "income_source": "Dunzo & Shadowfax",
        "risk_preference": "Conservative",
        "profile": {
            "average_daily_income": 650.0,
            "average_monthly_income": 19500.0,
            "income_frequency": "Daily",
            "essential_expenses": 12500.0,
            "work_expenses": 3200.0,
            "existing_emi": 1200.0,
            "current_savings": 3500.0,
            "emergency_target": 25000.0,
            "emergency_months": 6,
            "stability_score": 52.0
        },
        "income_history": [18000, 19500, 21000],
        "expenses": [
            {"title": "Room Rent Share", "category": "Rent", "group": "Essential", "amount": 6500.0, "date": "2026-09-01"},
            {"title": "Mess Food", "category": "Food", "group": "Essential", "amount": 4500.0, "date": "2026-09-03"},
            {"title": "Electric & Water", "category": "Utilities", "group": "Essential", "amount": 1500.0, "date": "2026-09-05"},
            {"title": "Scooter Fuel", "category": "Fuel", "group": "Work", "amount": 2500.0, "date": "2026-09-07"},
            {"title": "Phone Pack", "category": "Mobile/Data", "group": "Work", "amount": 700.0, "date": "2026-09-10"},
            {"title": "Smartphone EMI", "category": "EMI", "group": "Financial", "amount": 1200.0, "date": "2026-09-15"}
        ],
        "goals": [
            {"name": "Initial Safety Deposit", "target_amount": 25000.0, "current_amount": 3500.0, "deadline": "2027-04-30", "category": "Emergency"}
        ]
    }
}
