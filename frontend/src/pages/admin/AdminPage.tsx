import { useAuthStore } from "@/stores/useAuthStore";

import { Album, Music, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Header from "./component/Header";
// import DashboardStats from "./component/DashboardStats";
import AlbumsTabContent from "./component/AlbumsTabContent";
import SongsTabContent from "./component/SongsTabContent";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import UsersTabContent from "./component/UsersTabContent";
import DashboardStats from "./component/DashboardStats";
import PendingSongsTabContent from "./component/pending/PendingSongsTabContent";
import PendingAlbumsTabContent from "./component/pending/PendingAlbumsTabContent";

const AdminPage = () => {
  const { currentUser, isLoading } = useAuthStore();

  const isAdmin = currentUser?.role === "admin";
  const isModerator = currentUser?.role === "moderator";

  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  const [selectedTab, setSelectedTab] = useState("songs");

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  // Nếu không phải admin hoặc moderator và không còn loading => không cho xem
  if (!isAdmin && !isModerator && !isLoading) return <div>Unauthorized</div>;

  // Tabs cho admin và moderator (chỉ admin có tab users)
  const tabs = [
    { value: "songs", label: "Songs", icon: <Music className="mr-2 size-4" /> },
    {
      value: "albums",
      label: "Albums",
      icon: <Album className="mr-2 size-4" />,
    },
    {
      value: "pending-songs",
      label: "Review Songs",
      icon: <Music className="mr-2 size-4 text-yellow-400" />,
    },
    {
      value: "pending-albums",
      label: "Review Albums",
      icon: <Album className="mr-2 size-4 text-yellow-400" />,
    }, // tab mới
  ];

  if (isAdmin) {
    tabs.push({
      value: "users",
      label: "Users",
      icon: <Users className="mr-2 size-4" />,
    });
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8"
    >
      <Header />
      <DashboardStats />
      <Tabs
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

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
        <TabsContent value="pending-songs">
          <PendingSongsTabContent />
        </TabsContent>
        <TabsContent value="pending-albums">
          <PendingAlbumsTabContent /> {/* Nội dung tab mới */}
        </TabsContent>
        {isAdmin && (
          <TabsContent value="users">
            <UsersTabContent />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPage;
