import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkUserRole } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token && userId) {
          // First ensure user exists in database
          try {
            await axiosInstance.post("/auth/callback", {
              id: userId,
            });
          } catch (error) {
            console.log("Error in auth callback", error);
          }

          // Then fetch user data
          await checkUserRole();
          initSocket(userId);
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const intervalId = setInterval(async () => {
      const newToken = await getToken();
      console.log("🌱 Token refreshed:", newToken);
      updateApiToken(newToken);
    }, 1 * 60 * 1000); // every 4 minutes

    return () => {
      disconnectSocket();
      clearInterval(intervalId); // ✅ clear to avoid memory leaks
    };
  }, [getToken, userId, checkUserRole, initSocket, disconnectSocket]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
