export function validateChatQuery(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }
  if (!data.query || typeof data.query !== "string" || data.query.trim().length === 0) {
    errors.push("query is required and must be a non-empty string");
  }
  return { valid: errors.length === 0, errors };
}
