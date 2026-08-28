#!/usr/bin/env python3
"""Evaluates Grid Energy demand forecast model performance."""
from backend.python.app.ml.energy.evaluator import evaluate_energy_forecast

def main():
    actual = [3400.0, 3800.0, 4200.0, 4800.0, 4600.0]
    predicted = [3420.0, 3780.0, 4190.0, 4750.0, 4620.0]
    metrics = evaluate_energy_forecast(actual, predicted)
    print("Energy Demand Evaluation Metrics:", metrics)

if __name__ == "__main__":
    main()
