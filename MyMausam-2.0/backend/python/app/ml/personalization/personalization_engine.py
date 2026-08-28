from typing import List, Dict, Any

class PersonalizationEngine:
    def rank_widgets(self, persona: str, available_widgets: List[str]) -> List[str]:
        affinity = {
            "farmer": ["agromet_bulletin", "rain_timeline", "weather_hero", "doppler_radar"],
            "runner": ["activity_planner", "aqi_card", "hourly_slider", "weather_hero"],
            "health": ["aqi_card", "health_index", "hourly_slider", "weather_hero"],
            "commuter": ["route_nowcast", "doppler_radar", "rain_timeline", "weather_hero"],
        }
        preferred = affinity.get(persona, ["weather_hero", "aqi_card", "hourly_slider", "daily_forecast"])
        remaining = [w for w in available_widgets if w not in preferred]
        return preferred + remaining

personalization_engine = PersonalizationEngine()
