import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleCreatePlaylist = async (
    title: string,
    description: string,
    imageFile?: File
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    formData.append("songIds", JSON.stringify([itemId]));

    try {
      await createOrUpdatePlaylist(formData);
      toast.success("New playlist created successfully");
    } catch (error) {
      console.error("Error in handleCreatePlaylist:", error);
      toast.error("Error creating playlist");
      throw error;
    } finally {
      setNewPlaylistModalOpen(false);
      setOpen(false);
    }
  };

  const handleUpdatePlaylist = async (
    title: string,
    description: string,
    imageFile?: File
  ) => {
    if (!playlistToEdit) {
      toast.error("Playlist does not exist");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    formData.append(
      "songIds",
      JSON.stringify(playlistToEdit.songs.map((s) => s._id))
    );
    formData.append("playlistId", playlistToEdit._id);

    try {
      await createOrUpdatePlaylist(formData, playlistToEdit._id);
      toast.success("Playlist updated successfully");
    } catch (error) {
      console.error("Error in handleUpdatePlaylist:", error);
      toast.error("Error updating playlist");
      throw error;
    } finally {
      setEditPlaylistModalOpen(false);
      setOpen(false);
    }
  };

  const handleShare = () => {
    let shareUrl = "";
    switch (itemType) {
      case "song":
        shareUrl = `/songs/${itemId}`;
        break;
      case "playlist":
        shareUrl = `/playlists/${itemId}`;
        break;
      case "album":
        shareUrl = `/albums/${itemId}`;
        break;
      default:
        shareUrl = "/";
    }
    const fullUrl = window.location.origin + shareUrl;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
        toast.error("Error sharing");
      });
    setOpen(false);
  };

  const handleDeletePlaylist = async () => {
    if (itemType === "playlist") {
      try {
        await deletePlaylist(itemId);
        toast.success("Playlist deleted successfully");
      } catch (error) {
        console.error("Error in handleDeletePlaylist:", error);
        toast.error("Error deleting playlist");
      }
    }
    setOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  Add to playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 p-2 bg-gray-800 border border-gray-600 shadow-lg rounded-md text-white">
                  <input
                    type="text"
                    placeholder="Search playlists"
                    className="w-full mb-2 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <DropdownMenuItem
                    onClick={() => handleAddToPlaylist()}
                    className="hover:bg-gray-700 mb-1"
                  >
                    + Add to new playlist
                  </DropdownMenuItem>
                  <div className="max-h-48 overflow-y-auto scrollbar-hide">
                    {filteredPlaylists.length === 0 && (
                      <div className="px-2 py-2 text-sm text-gray-400">
                        No playlists found
                      </div>
                    )}
                    {filteredPlaylists.slice(0, 20).map((playlist) => (
                      <DropdownMenuItem
                        key={playlist._id}
                        onClick={() => handleAddToPlaylist(playlist._id)}
                        className="hover:bg-gray-700"
                      >
                        {playlist.title}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
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
