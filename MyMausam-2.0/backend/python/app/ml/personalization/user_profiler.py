def infer_user_persona(user_behavior: dict) -> str:
    if user_behavior.get("searches_agromet", 0) > 3:
        return "farmer"
    if user_behavior.get("searches_air_quality", 0) > 3:
        return "health"
    if user_behavior.get("searches_transit", 0) > 3:
        return "commuter"
    return "health"
