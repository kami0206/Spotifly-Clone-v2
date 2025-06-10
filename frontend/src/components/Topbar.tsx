import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import SignInForm from "./SignInFrom";

const Topbar = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const isModerator = useAuthStore((state) => state.isModerator());
  const isUser = useAuthStore((state) => state.isUser());
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="size-8" alt="spotify logo" />
        <span className="text-white font-semibold">Spotify</span>
      </div>
      <div className="flex gap-4 items-center">
        {(isAdmin || isModerator) && (
          <Link
            to="/admin"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-white border-gray-600 hover:bg-zinc-700"
            )}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}
        {isUser && (
          <Link
            to="/user" // Adjust to your user dashboard route
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-white border-gray-600 hover:bg-zinc-700"
            )}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            User Dashboard
          </Link>
        )}
        <SignedOut>
          <button
            onClick={() => setIsFormVisible(true)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-white border-gray-600 hover:bg-zinc-700"
            )}
          >
            Sign In
          </button>
        </SignedOut>
        <UserButton />
        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 min-h-screen max-h-full">
            <SignInForm onClose={() => setIsFormVisible(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
