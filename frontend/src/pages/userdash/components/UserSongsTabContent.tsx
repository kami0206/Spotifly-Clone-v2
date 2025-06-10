import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, CheckCircle, Clock, XCircle } from "lucide-react";
import { UserStatsCard } from "./UserStatsCard";
import { UserSongsTable } from "./UserSongsTable";
import AddSongDialog from "@/pages/admin/component/AddSongDialog";
import { useMusicStore } from "@/stores/useMusicStore";

interface Props {
  userId: string;
}

export const UserSongsTabContent: React.FC<Props> = ({ userId }) => {
  const { songs, fetchSongsByUser, isLoading, error } = useMusicStore();

  useEffect(() => {
    if (userId) {
      fetchSongsByUser(userId);
    }
  }, [userId, fetchSongsByUser]);
  console.log("UserId", userId);

  console.log("UserSongsTabContent songs:", songs);

  const approvedSongs = songs.filter((song) => song.status === "approved");
  const pendingSongs = songs.filter(
    (song) => song.status === "pending" || !song.status
  );
  const rejectedSongs = songs.filter((song) => song.status === "rejected");

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-500 text-center font-semibold">{error}</div>
      )}

      {/* Song status statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStatsCard
          icon={CheckCircle}
          label="Approved"
          value={approvedSongs.length}
          bgColor="bg-green-500/20"
          iconColor="text-green-400"
        />
        <UserStatsCard
          icon={Clock}
          label="Pending"
          value={pendingSongs.length}
          bgColor="bg-yellow-500/20"
          iconColor="text-yellow-400"
        />
        <UserStatsCard
          icon={XCircle}
          label="Rejected"
          value={rejectedSongs.length}
          bgColor="bg-red-500/20"
          iconColor="text-red-400"
        />
      </div>

      {/* Songs table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-400" />
              Your Songs
            </CardTitle>
            <CardDescription>Manage your uploaded songs</CardDescription>
          </div>
          <AddSongDialog />
        </CardHeader>
        <CardContent>
          <UserSongsTable isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};
