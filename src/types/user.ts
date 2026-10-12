export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

export type SubscriptionTier = "Free" | "Ponsel" | "Standar" | "Premium VIP";

export interface WatchHistoryItem {
  movieId: number;
  episodeId?: number;
  seasonNumber?: number;
  episodeTitle?: string;
  progressSeconds: number;
  durationSeconds: number;
  lastWatched: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  profiles: UserProfile[];
  currentProfileId: string;
  subscriptionPlan: SubscriptionTier;
  subscriptionExpires?: string;
  createdAt: string;
}
