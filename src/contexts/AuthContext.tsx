import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  username: string;
  instagramUsername: string;
  verified: boolean;
  phone: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

type ProfileUpdates = Pick<AccountUser, "displayName" | "bio" | "avatarUrl" | "username" | "instagramUsername" | "phone" | "address">;

interface AuthContextType {
  user: AccountUser | null;
  profile: AccountUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: ProfileUpdates) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: Blob) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const request = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Unable to complete the request");
  }
  return response.status === 204 ? (undefined as T) : response.json();
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const data = await request<{ user: AccountUser }>("/api/auth/me");
    setUser(data.user);
  };

  useEffect(() => {
    refreshProfile()
      .catch((error) => {
        if (error instanceof Error && error.message !== "Authentication required") {
          console.error("Unable to restore session:", error);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const data = await request<{ user: AccountUser }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, displayName }),
      });
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Sign up failed") };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await request<{ user: AccountUser }>("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Sign in failed") };
    }
  };

  const signOut = async () => {
    await request<void>("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (updates: ProfileUpdates) => {
    try {
      const data = await request<{ user: AccountUser }>("/api/account", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Profile update failed") };
    }
  };

  const uploadAvatar = async (file: Blob) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file, "profile.jpg");
      const response = await fetch("/api/account/avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.message || "Image upload failed");
      setUser(payload.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Image upload failed") };
    }
  };

  const resetPassword = async (_email: string) => ({
    error: new Error("Password reset email delivery is not configured. Contact support for assistance."),
  });

  return (
    <AuthContext.Provider
      value={{ user, profile: user, loading, signUp, signIn, signOut, resetPassword, refreshProfile, updateProfile, uploadAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};
