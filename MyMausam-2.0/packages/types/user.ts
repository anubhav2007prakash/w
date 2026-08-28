export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  default_location: string;
  persona: string;
  language: string;
  temp_unit: "C" | "F";
  wind_unit: "km/h" | "mph" | "knots";
  push_notifications: boolean;
  auto_location: boolean;
}
