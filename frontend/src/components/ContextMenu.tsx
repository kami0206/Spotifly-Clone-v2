import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useMusicStore } from "@/stores/useMusicStore";
import NewPlaylistModal from "./NewPlaylistModal";
import EditPlaylistModal from "./Edit";

interface ContextMenuProps {
  itemType: "playlist" | "song" | "album";
  itemId: string;
  itemTitle: string;
  isInPlaylist?: boolean;
  playlistId?: string;
  children?: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  itemType,
  itemId,
  isInPlaylist = false,
  playlistId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [newPlaylistModalOpen, setNewPlaylistModalOpen] = useState(false);
  const [editPlaylistModalOpen, setEditPlaylistModalOpen] = useState(false);

  const {
    playlists,
    removeSongsFromPlaylist,
    createOrUpdatePlaylist,
    deletePlaylist,
  } = useMusicStore();

  const playlistToEdit = playlists.find((p) => p._id === itemId);

  const handleRemoveFromPlaylist = async () => {
    if (itemType === "song" && isInPlaylist) {
      try {
        const pid = playlistId || useMusicStore.getState().currentPlaylist?._id;
        if (!pid) throw new Error("Playlist not found");
        await removeSongsFromPlaylist(pid, [itemId]);
        toast.success("Successfully removed song from playlist");
      } catch {
        toast.error("Error removing song from playlist");
      }
    }
    setOpen(false);
  };

  const handleAddToPlaylist = async (playlistId?: string) => {
    if (!playlistId) {
      setOpen(false);
      setNewPlaylistModalOpen(true);
    } else {
      const playlist = playlists.find((p) => p._id === playlistId);
      if (playlist) {
        const existingSongIds = [...new Set(playlist.songs.map((s) => s._id))];
        if (existingSongIds.includes(itemId)) {
          toast.error("Song already exists in this playlist");
          return;
        }
        const formData = new FormData();
        formData.append("title", playlist.title);
        formData.append("description", playlist.description || "");
        formData.append(
          "songIds",
          JSON.stringify([...existingSongIds, itemId])
        );
        formData.append("playlistId", playlist._id);

        try {
          await createOrUpdatePlaylist(formData, playlist._id);
          toast.success("Successfully added to playlist");
        } catch (error) {
          console.error("Error in handleAddToPlaylist:", error);
          toast.error("Error adding song to playlist");
        }
      }
      setOpen(false);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const formData = new FormData();
      formData.append("title", "New Playlist");
      formData.append("songIds", JSON.stringify([itemId]));
      await createOrUpdatePlaylist(formData);
      toast.success("New playlist created successfully");
    } catch (error: any) {
      toast.error(error.message || "Error creating playlist");
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      const formData = new FormData();
      formData.append("title", "New Title");
      await createOrUpdatePlaylist(formData, playlistId);
      toast.success("Playlist updated successfully");
      setEditPlaylistModalOpen(false);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error updating playlist");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (error: any) {
      toast.error(error.message || "Error sharing");
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(itemId);
      toast.success("Playlist deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting playlist");
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) setOpen(false);
        }}
      >
        <DropdownMenuTrigger asChild>
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            onClick={handleTriggerClick}
            className="relative"
          >
            {children}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 p-1 bg-gray-800 border border-gray-600 shadow-lg rounded-md text-white">
          {itemType === "playlist" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditPlaylistModalOpen(true);
                  setOpen(false);
                }}
                className="hover:bg-gray-700"
              >
                Edit playlist
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeletePlaylist}
                className="text-red-400 hover:bg-gray-700"
              >
                Delete playlist
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={handleShare}
            className="hover:bg-gray-700 text-blue-400"
          >
            Share
          </DropdownMenuItem>
          {itemType === "song" && (
            <>
              {isInPlaylist && (
                <DropdownMenuItem
                  onClick={handleRemoveFromPlaylist}
                  className="text-red-400 hover:bg-gray-700"
                >
                  Remove from playlist
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleAddToPlaylist(playlistId || "")}
                className="hover:bg-gray-700"
              >
                Add to new playlist
              </DropdownMenuItem>
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="hover:bg-gray-700"
                >
                  Add to {playlist.title}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {itemType === "song" && (
        <NewPlaylistModal
          open={newPlaylistModalOpen}
          onClose={() => setNewPlaylistModalOpen(false)}
          onCreate={handleCreatePlaylist}
        />
      )}

      {itemType === "playlist" && playlistToEdit && (
        <EditPlaylistModal
          open={editPlaylistModalOpen}
          onClose={() => setEditPlaylistModalOpen(false)}
          onSave={handleUpdatePlaylist}
          initialTitle={playlistToEdit.title}
          initialDescription={playlistToEdit.description || ""}
          initialImageUrl={playlistToEdit.imageUrl || ""}
        />
      )}
    </>
  );
};

export default ContextMenu;
