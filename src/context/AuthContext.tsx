"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount, UserProfile, SubscriptionTier } from "@/types/user";

interface AuthContextType {
  user: UserAccount | null;
  currentProfile: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  switchProfile: (profileId: string) => void;
  addProfile: (name: string, isKids: boolean) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
}

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: "prof_1",
    name: "Akun Utama",
    avatar: "from-blue-600 to-indigo-800",
    isKids: false,
  },
  {
    id: "prof_2",
    name: "Anak-anak (Kids)",
    avatar: "from-amber-500 to-orange-600",
    isKids: true,
  },
  {
    id: "prof_3",
    name: "Keluarga",
    avatar: "from-emerald-500 to-teal-700",
    isKids: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("flixora_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null); // Guest mode secara default agar Landing Page tampil
      }
    } catch {
      setUser(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveUser = (updatedUser: UserAccount | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem("flixora_user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("flixora_user");
    }
  };

  const login = (email: string): boolean => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split("@")[0] || "User Flixora",
      profiles: DEFAULT_PROFILES,
      currentProfileId: "prof_1",
      subscriptionPlan: "Premium VIP",
      subscriptionExpires: "12 Des 2026",
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const register = (name: string, email: string): boolean => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email,
      name,
      profiles: [
        {
          id: "prof_1",
          name,
          avatar: "from-purple-600 to-pink-700",
          isKids: false,
        },
        {
          id: "prof_2",
          name: "Kids Mode",
          avatar: "from-amber-500 to-orange-600",
          isKids: true,
        },
      ],
      currentProfileId: "prof_1",
      subscriptionPlan: "Premium VIP",
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const switchProfile = (profileId: string) => {
    if (!user) return;
    const updated = { ...user, currentProfileId: profileId };
    saveUser(updated);
    setIsProfileModalOpen(false);
  };

  const addProfile = (name: string, isKids: boolean) => {
    if (!user) return;
    const newProfile: UserProfile = {
      id: `prof_${Date.now()}`,
      name,
      avatar: isKids ? "from-yellow-400 to-orange-500" : "from-rose-600 to-red-800",
      isKids,
    };
    const updated = {
      ...user,
      profiles: [...user.profiles, newProfile],
    };
    saveUser(updated);
  };

  const upgradeSubscription = (tier: SubscriptionTier) => {
    if (!user) return;
    const updated: UserAccount = {
      ...user,
      subscriptionPlan: tier,
      subscriptionExpires: "12 Okt 2027",
    };
    saveUser(updated);
    setIsSubscriptionModalOpen(false);
  };

  const currentProfile =
    user?.profiles.find((p) => p.id === user.currentProfileId) ||
    user?.profiles[0] ||
    null;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentProfile,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchProfile,
        addProfile,
        upgradeSubscription,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
