import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Album } from "lucide-react";
import { UserPageHeader } from "./components/UserPageHeader";
import { UserSongsTabContent } from "./components/UserSongsTabContent";
import { UserAlbumsTabContent } from "./components/UserAlbumsTabContent";

const UserPage = () => {
  const { currentUser } = useAuthStore();
  const { fetchSongsByUser, fetchAlbumsByUser } = useMusicStore();

  const [selectedTab, setSelectedTab] = useState("songs");

  useEffect(() => {
    if (currentUser?.clerkId) {
      fetchSongsByUser(currentUser.clerkId);
      fetchAlbumsByUser(currentUser.clerkId);
    }
  }, [currentUser, fetchSongsByUser, fetchAlbumsByUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 flex items-center justify-center">
        <div>Please log in to view this page</div>
      </div>
    );
  }

  const tabs = [
    // { value: "overview", label: "Overview", icon: <BarChart3 className="mr-2 size-4" /> },
    {
      value: "songs",
      label: "Songs",
      icon: <Music className="mr-2 size-4" />,
    },
    {
      value: "albums",
      label: "Albums",
      icon: <Album className="mr-2 size-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <UserPageHeader />
      {/* <UserDashboardStats /> */}

      <Tabs
        defaultValue="songs"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="p-1 bg-zinc-800/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-zinc-700"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* <TabsContent value="overview">
          <UserOverviewTab />
        </TabsContent> */}

        <TabsContent value="songs">
          {currentUser._id ? (
            <UserSongsTabContent userId={currentUser.clerkId} />
          ) : (
            <div className="text-zinc-400 text-sm">Loading user data...</div>
          )}
        </TabsContent>

        <TabsContent value="albums">
          <UserAlbumsTabContent userId={currentUser.clerkId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default UserPage;
