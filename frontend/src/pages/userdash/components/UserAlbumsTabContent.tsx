import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMusicStore } from "@/stores/useMusicStore";
import { CheckCircle, Clock, Library, XCircle } from "lucide-react";
import { UserStatsCard } from "./UserStatsCard";
import { UserAlbumsTable } from "./UserAlbumsTable";
import AddAlbumDialog from "@/pages/admin/component/AddAlbumDialog";

interface Props {
  userId: string;
}

export const UserAlbumsTabContent: React.FC<Props> = ({ userId }) => {
  const { albums, fetchAlbumsByUser, isLoading, error } = useMusicStore();

  useEffect(() => {
    if (userId) {
      fetchAlbumsByUser(userId);
    }
  }, [userId, fetchAlbumsByUser]);

  const approvedAlbums = albums.filter((album) => album.status === "approved");
  const pendingAlbums = albums.filter(
    (album) => album.status === "pending" || !album.status
  );
  const rejectedAlbums = albums.filter((album) => album.status === "rejected");

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-500 text-center font-semibold">{error}</div>
      )}

      {/* Album status statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStatsCard
          icon={CheckCircle}
          label="Approved"
          value={approvedAlbums.length}
          bgColor="bg-green-500/20"
          iconColor="text-green-400"
        />
        <UserStatsCard
          icon={Clock}
          label="Pending"
          value={pendingAlbums.length}
          bgColor="bg-yellow-500/20"
          iconColor="text-yellow-400"
        />
        <UserStatsCard
          icon={XCircle}
          label="Rejected"
          value={rejectedAlbums.length}
          bgColor="bg-red-500/20"
          iconColor="text-red-400"
        />
      </div>

      {/* Albums table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="size-5 text-emerald-400" />
              Your Albums
            </CardTitle>
            <CardDescription>Manage your uploaded albums</CardDescription>
          </div>
          <AddAlbumDialog />
        </CardHeader>
        <CardContent>
          <UserAlbumsTable isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};
