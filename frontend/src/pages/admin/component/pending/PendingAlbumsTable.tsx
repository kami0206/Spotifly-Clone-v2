import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Check, X } from "lucide-react";
import { useState } from "react";

const PendingAlbumsTable = () => {
  const { pendingAlbums, updateAlbumStatus, fetchPendingAlbums } =
    useMusicStore();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  if (!pendingAlbums || pendingAlbums.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-6">No pending albums.</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingAlbums.map((album) => (
          <TableRow key={album._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img
                src={album.imageUrl}
                alt={album.title}
                className="size-10 rounded object-cover"
              />
            </TableCell>
            <TableCell>{album.title}</TableCell>
            <TableCell>{album.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {album.createdAt?.split("T")[0]}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingIds.includes(album._id)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10 disabled:opacity-50"
                  onClick={async () => {
                    setLoadingIds((prev) => [...prev, album._id]);
                    await updateAlbumStatus(album._id, "approved");
                    await fetchPendingAlbums();
                    setLoadingIds((prev) =>
                      prev.filter((id) => id !== album._id)
                    );
                  }}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingIds.includes(album._id)}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 disabled:opacity-50"
                  onClick={async () => {
                    setLoadingIds((prev) => [...prev, album._id]);
                    await updateAlbumStatus(album._id, "rejected");
                    await fetchPendingAlbums();
                    setLoadingIds((prev) =>
                      prev.filter((id) => id !== album._id)
                    );
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingAlbumsTable;
