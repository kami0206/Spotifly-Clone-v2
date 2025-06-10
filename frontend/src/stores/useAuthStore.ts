import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { User } from "@/type";

interface AuthStore {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  checkUserRole: () => Promise<void>;
  reset: () => void;

  isAdmin: () => boolean;
  isModerator: () => boolean;
  isUser: () => boolean;

  updateUserRole: (userId: string, newRole: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  checkUserRole: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/me");
      set({ currentUser: response.data.user });
    } catch (error: any) {
      set({
        currentUser: null,
        error: error.response?.data?.message || "Failed to fetch user data",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ currentUser: null, isLoading: false, error: null });
  },

  isAdmin: () => get().currentUser?.role === "admin",
  isModerator: () => get().currentUser?.role === "moderator",
  isUser: () => get().currentUser?.role === "user",

  updateUserRole: async (userId, newRole) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch(`/admin/role/${userId}`, {
        role: newRole,
        canUpload: newRole === "moderator",
      });
      // Update currentUser if the userId matches
      const currentUser = get().currentUser;
      if (currentUser && userId === currentUser._id) {
        set({
          currentUser: {
            ...currentUser,
            role: newRole as "user" | "admin" | "moderator",
            canUpload: newRole === "moderator",
          },
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update user role",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
