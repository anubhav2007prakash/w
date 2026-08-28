from typing import List, Dict, Any

def get_recommendations_for_persona(persona: str = "health") -> List[Dict[str, Any]]:
    recommendations = {
        "health": [
            {"id": "rec-1", "persona": "health", "title": "UV Protective Gear", "description": "High UV levels detected. Wear SPF 30+ sunscreen and sunglasses.", "impact_score": 90, "category": "Wellness", "action_url": "/health-index"},
            {"id": "rec-2", "persona": "health", "title": "Hydration Reminder", "description": "High humidity index; consume at least 3 litres of water today.", "impact_score": 85, "category": "Hydration", "action_url": "/health-index"},
        ],
        "farmer": [
            {"id": "rec-3", "persona": "farmer", "title": "Foliar Spray Window", "description": "Clear skies from 6:00 AM to 8:30 AM before convective cloud formation.", "impact_score": 95, "category": "Agriculture", "action_url": "/agromet"},
        ],
        "runner": [
            {"id": "rec-4", "persona": "runner", "title": "Optimal Jogging Window", "description": "Temperature and AQI are optimal between 5:30 AM and 7:00 AM.", "impact_score": 88, "category": "Fitness", "action_url": "/activity-planner"},
        ]
    }
    return recommendations.get(persona, recommendations["health"])
