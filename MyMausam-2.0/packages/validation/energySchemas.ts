export function validateEnergyOptimizationRequest(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }
  if (data.rooftop_area_sqft !== undefined && (typeof data.rooftop_area_sqft !== "number" || data.rooftop_area_sqft <= 0)) {
    errors.push("rooftop_area_sqft must be a positive number");
  }
  return { valid: errors.length === 0, errors };
}
