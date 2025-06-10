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

const PendingSongsTable = () => {
  const { pendingSongs, isLoading, reviewSong, albums } = useMusicStore();
  const findAlbumTitle = (albumId: string | null) => {
    if (!albumId) return "No Album (single)";
    const album = albums.find((a) => a._id === albumId);
    return album ? album.title : "No Album (single)";
  };
  if (isLoading) {
    return (
      <div className="text-center text-zinc-400 py-6">Loading songs...</div>
    );
  }

  if (!pendingSongs || pendingSongs.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-6">No pending songs.</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingSongs.map((song) => (
          <TableRow key={song._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img
                src={song.imageUrl}
                alt={song.title}
                className="size-10 rounded object-cover"
              />
            </TableCell>
            <TableCell className="">{song.title}</TableCell>
            <TableCell>{song.artist}</TableCell>
            <TableCell className="">{findAlbumTitle(song.albumId)}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {song.createdAt.split("T")[0]}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                  onClick={() => reviewSong(song._id, "approve")}
                >
                  <Check className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                  onClick={() => reviewSong(song._id, "reject")}
                >
                  <X className="size-4" />
                </Button>

                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => deleteSong(song._id)}
                >
                  <Trash2 className="size-4" />
                </Button> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingSongsTable;
