def sort_widgets_by_score(widgets: list[dict]) -> list[dict]:
    return sorted(widgets, key=lambda w: w.get("order", 0))
