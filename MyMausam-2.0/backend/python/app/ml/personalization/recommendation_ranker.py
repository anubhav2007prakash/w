def rank_recommendations(recs: list[dict], persona: str) -> list[dict]:
    return sorted(recs, key=lambda r: r.get("impact_score", 0), reverse=True)
