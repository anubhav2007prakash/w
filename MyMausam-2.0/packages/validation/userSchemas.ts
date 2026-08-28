export function validateUserSettings(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }
  if (data.temp_unit && !["C", "F"].includes(data.temp_unit)) {
    errors.push("temp_unit must be 'C' or 'F'");
  }
  return { valid: errors.length === 0, errors };
}
