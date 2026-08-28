def min_max_scale(val: float, min_val: float, max_val: float) -> float:
    if max_val == min_val:
        return 0.0
    return (val - min_val) / (max_val - min_val)
