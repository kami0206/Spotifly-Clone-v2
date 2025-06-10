import { useMusicStore } from "@/stores/useMusicStore";
import { Music, Album, CheckCircle, Clock } from "lucide-react";
import { UserStatsCard } from "./UserStatsCard";

export const UserDashboardStats = () => {
  const { userStats, isLoading } = useMusicStore();

  if (isLoading) {
    return (
      <div className="text-center text-zinc-400">Đang tải thống kê...</div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center text-zinc-400">Không có dữ liệu thống kê</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UserStatsCard
        icon={Music}
        label="Tổng bài hát"
        value={userStats.songs.total || 0}
        bgColor="bg-blue-500/20"
        iconColor="text-blue-400"
      />
      <UserStatsCard
        icon={Album}
        label="Tổng album"
        value={userStats.albums.total || 0}
        bgColor="bg-purple-500/20"
        iconColor="text-purple-400"
      />
      <UserStatsCard
        icon={CheckCircle}
        label="Đã được duyệt"
        value={
          (userStats.songs.statusBreakdown.approved || 0) +
          (userStats.albums.statusBreakdown.approved || 0)
        }
        bgColor="bg-green-500/20"
        iconColor="text-green-400"
      />
      <UserStatsCard
        icon={Clock}
        label="Chờ duyệt"
        value={
          (userStats.songs.statusBreakdown.pending || 0) +
          (userStats.albums.statusBreakdown.pending || 0)
        }
        bgColor="bg-yellow-500/20"
        iconColor="text-yellow-400"
      />
    </div>
  );
};
