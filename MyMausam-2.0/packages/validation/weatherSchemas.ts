export function validateCrowdReport(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }
  if (!data.location_name || typeof data.location_name !== "string") {
    errors.push("location_name is required");
  }
  if (!data.condition || typeof data.condition !== "string") {
    errors.push("condition is required");
  }
  return { valid: errors.length === 0, errors };
}
