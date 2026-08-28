import { WidgetType } from "../constants/widgetTypes";

export interface DashboardWidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  order: number;
  is_visible: boolean;
  size: "small" | "medium" | "large" | "full";
  persona_affinity?: string[];
}
