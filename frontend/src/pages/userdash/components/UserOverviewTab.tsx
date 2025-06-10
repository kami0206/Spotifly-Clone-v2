import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

export const UserOverviewTab = () => {
  const { currentUser, isLoading: authLoading } = useAuthStore();
  const { userStats } = useMusicStore();

  if (authLoading) {
    return (
      <div className="text-center text-zinc-400">Loading user data... </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.imageUrl || "/default-avatar.png"}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{currentUser.fullName}</h3>
              <p className="text-zinc-400">{currentUser.email}</p>
              <Badge variant="secondary" className="mt-2">
                {currentUser.role === "admin"
                  ? "Quản trị viên"
                  : currentUser.role === "moderator"
                  ? "Kiểm duyệt viên"
                  : "Người dùng"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Assuming createdAt is added to User interface */}
            {/* <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-zinc-400">
                Tham gia từ{" "}
                {currentUser.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </span>
            </div> */}
            {userStats && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-zinc-400">
                    Đã đăng {userStats.songs.total || 0} bài hát
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-zinc-400">
                    Đã tạo {userStats.albums.total || 0} album
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
