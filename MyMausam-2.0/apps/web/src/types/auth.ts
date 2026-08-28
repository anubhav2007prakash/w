import { PersonaType } from "./weather";

export type UserRole = "citizen" | "farmer" | "official" | "aviation" | "researcher";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  persona: PersonaType;
  defaultLocation: string;
  defaultDistrict?: string;
  defaultState?: string;
  avatarUrl?: string;
  avatarId?: string;
  isVerified?: boolean;
  memberSince?: string;
  badge?: string;
  preferredLanguage?: string;
}

export interface AuthCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  name?: string;
  persona?: PersonaType;
  defaultLocation?: string;
  avatarUrl?: string;
  avatarId?: string;
  role?: UserRole;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  login: (credentials: { email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (details: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: (demoKey: "citizen" | "farmer" | "official" | "aviation") => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
