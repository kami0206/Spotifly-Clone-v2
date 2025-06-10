import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { getStatusBadge } from "./StatusBadge";

interface Props {
  isLoading?: boolean;
}

export const UserAlbumsTable: React.FC<Props> = ({ isLoading = false }) => {
  const { albums, deleteAlbum } = useMusicStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Đang tải album...</div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        Bạn chưa đăng tải album nào.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Tên album</TableHead>
          <TableHead>Nghệ sĩ</TableHead>
          <TableHead>Số bài hát</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albums.map((album) => (
          <TableRow key={album._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img
                src={album.imageUrl}
                alt={album.title}
                className="size-10 rounded object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{album.title}</TableCell>
            <TableCell>{album.artist}</TableCell>
            <TableCell>
              <span className="text-zinc-400">
                {album.songs?.length || 0} bài
              </span>
            </TableCell>
            <TableCell>{getStatusBadge(album.status || "pending")}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {album.createdAt
                  ? new Date(album.createdAt).toLocaleDateString("vi-VN")
                  : "N/A"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => deleteAlbum(album._id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
