from typing import List

def predict_energy_demand_lstm(sequence_history: List[float]) -> float:
    if not sequence_history:
        return 4200.0
    return round(sequence_history[-1] * 1.02, 1)
