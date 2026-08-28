export interface EnvironmentConfig {
  name: "development" | "staging" | "production";
  apiUrl: string;
  enableDebugLogs: boolean;
  enableAnalytics: boolean;
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  development: {
    name: "development",
    apiUrl: "http://127.0.0.1:8000/api",
    enableDebugLogs: true,
    enableAnalytics: false,
  },
  staging: {
    name: "staging",
    apiUrl: "https://staging-api.mymausam.org/api",
    enableDebugLogs: true,
    enableAnalytics: true,
  },
  production: {
    name: "production",
    apiUrl: "https://api.mymausam.org/api",
    enableDebugLogs: false,
    enableAnalytics: true,
  },
};

export const CURRENT_ENV: EnvironmentConfig =
  ENVIRONMENTS[process.env.NODE_ENV || "development"] || ENVIRONMENTS.development;
