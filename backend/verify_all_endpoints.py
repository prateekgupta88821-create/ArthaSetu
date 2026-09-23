import urllib.request
import json
import sys

# Ensure UTF-8 output if possible
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"

endpoints_to_test = [
    ("/", "GET", None),
    ("/api/personas/list", "GET", None),
    ("/api/dashboard", "GET", None),
    ("/api/income", "GET", None),
    ("/api/expenses", "GET", None),
    ("/api/health", "GET", None),
    ("/api/savings", "GET", None),
    ("/api/goals", "GET", None),
    ("/api/investing", "GET", None),
    ("/api/gadgets/default-comparison", "GET", None),
    ("/api/vehicles/ev-comparison", "GET", None),
    ("/api/tax", "GET", None),
    ("/api/forecast", "GET", None),
    ("/api/snapshot", "GET", None),
    ("/api/insights", "GET", None),
    ("/api/affordability", "POST", {
        "product_price": 60000,
        "down_payment": 10000,
        "emi_months": 24,
        "annual_interest_rate": 12.0
    }),
    ("/api/simulator", "POST", {
        "income_change_pct": -20,
        "expense_change_pct": 10,
        "new_monthly_emi": 1500,
        "one_time_purchase_amount": 0,
        "vehicle_switch_cost_delta": 0
    }),
    ("/api/ai/chat", "POST", {
        "question": "Can I afford a new phone?"
    }),
    ("/api/personas/switch/stable_worker", "POST", None),
    ("/api/dashboard", "GET", None),
    ("/api/personas/switch/rahul", "POST", None)
]

print("Starting end-to-end endpoint verification...")

passed = 0
failed = 0

for path, method, payload in endpoints_to_test:
    url = f"{BASE_URL}{path}"
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(payload).encode('utf-8') if payload else None
        
        with urllib.request.urlopen(req, data=data_bytes) as resp:
            status = resp.status
            body = json.loads(resp.read().decode('utf-8'))
            if status == 200:
                print(f"[OK] [{method}] {path} -> HTTP {status} SUCCESS")
                passed += 1
            else:
                print(f"[FAIL] [{method}] {path} -> HTTP {status}")
                failed += 1
    except Exception as e:
        print(f"[FAIL] [{method}] {path} -> FAILED with error: {e}")
        failed += 1

print(f"\nVerification finished: {passed} PASSED, {failed} FAILED out of {len(endpoints_to_test)} endpoints.")
