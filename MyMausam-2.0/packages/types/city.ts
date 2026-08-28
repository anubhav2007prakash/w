export interface CityItem {
  id: number;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  is_default?: boolean;
}

export interface CitySearchQuery {
  q: string;
  limit?: number;
}
