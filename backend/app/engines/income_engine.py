import statistics

def calculate_income_metrics(income_records: list[float]) -> dict:
    """
    Calculates statistical income metrics for gig workers.
    Ensures non-zero fallback for empty or single inputs.
    """
    if not income_records:
        return {
            "average_income": 0.0,
            "median_income": 0.0,
            "min_income": 0.0,
            "max_income": 0.0,
            "typical_range": [0.0, 0.0],
            "volatility_percentage": 0.0,
            "stability_score": 100.0,
            "trend": "stable",
            "sample_count": 0
        }
    
    clean_records = [float(x) for x in income_records if x is not None and x >= 0]
    if not clean_records:
        clean_records = [0.0]

    n = len(clean_records)
    avg_inc = round(statistics.mean(clean_records), 2)
    med_inc = round(statistics.median(clean_records), 2)
    min_inc = round(min(clean_records), 2)
    max_inc = round(max(clean_records), 2)
    
    if n > 1:
        stdev = statistics.stdev(clean_records)
        volatility_cv = (stdev / avg_inc * 100) if avg_inc > 0 else 0.0
    else:
        stdev = 0.0
        volatility_cv = 0.0

    # Typical range (10th to 90th percentile estimation or min-max bounds)
    lower_bound = max(0.0, round(avg_inc - stdev, 2)) if n > 1 else min_inc
    upper_bound = round(avg_inc + stdev, 2) if n > 1 else max_inc
    
    # Stability score: 100 - volatility penalty (capped between 0 and 100)
    stability_score = max(0.0, min(100.0, round(100 - (volatility_cv * 1.5), 1)))

    # Trend calculation
    if n >= 3:
        first_half = statistics.mean(clean_records[:n//2])
        second_half = statistics.mean(clean_records[n//2:])
        diff_pct = ((second_half - first_half) / first_half * 100) if first_half > 0 else 0
        if diff_pct > 5:
            trend = "improving"
        elif diff_pct < -5:
            trend = "declining"
        elif volatility_cv > 25:
            trend = "fluctuating"
        else:
            trend = "stable"
    else:
        trend = "stable"

    return {
        "average_income": avg_inc,
        "median_income": med_inc,
        "min_income": min_inc,
        "max_income": max_inc,
        "typical_range": [min_inc, max_inc],
        "std_dev_range": [lower_bound, upper_bound],
        "volatility_percentage": round(volatility_cv, 1),
        "stability_score": stability_score,
        "trend": trend,
        "sample_count": n
    }
