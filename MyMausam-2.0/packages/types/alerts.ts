export interface WeatherAlert {
  id: number;
  location_name: string;
  alert_type: string;
  severity: "green" | "yellow" | "orange" | "red" | string;
  description: string;
  date_of_issue: string;
  valid_upto: string;
  status_text: string;
  color?: string;
  is_active?: boolean;
}

export interface AlertFilter {
  severity?: string;
  location?: string;
  active_only?: boolean;
}
