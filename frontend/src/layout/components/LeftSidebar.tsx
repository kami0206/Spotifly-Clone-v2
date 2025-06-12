import ContextMenu from "@/components/ContextMenu";
import NewPlaylistModal from "@/components/NewPlaylistModal";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import {
  Album,
  HomeIcon,
  Library,
  MessageCircle,
  Music,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const {
    allAlbums,
    playlists,
    fetchAlbums,
    fetchPlaylists,
    isLoading,
    createOrUpdatePlaylist,
  } = useMusicStore();
  const { isSignedIn } = useAuth();

  const [newPlaylistModalOpen, setNewPlaylistModalOpen] = useState(false);

  useEffect(() => {
    fetchAlbums();
    if (isSignedIn) {
      fetchPlaylists();
    }
  }, [fetchAlbums, fetchPlaylists, isSignedIn]);

  const handleCreatePlaylist = async (
    title: string,
    description: string,
    imageFile?: File
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) formData.append("imageFile", imageFile);
      formData.append("songIds", JSON.stringify([])); // Create empty playlist

      await createOrUpdatePlaylist(formData);
      toast.success("New playlist created successfully");
      setNewPlaylistModalOpen(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error("Error creating playlist");
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <Link
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800",
            })
          )}
        >
          <HomeIcon className="mr-2 size-5" />
          <span className="hidden md:inline">Home</span>
        </Link>

        <Link
          to={"/search"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800",
            })
          )}
        >
          <Search className="mr-2 size-5" />
          <span className="hidden md:inline">Search</span>
        </Link>

        <SignedIn>
          <Link
            to={"/chat"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <MessageCircle className="mr-2 size-5" />
            <span className="hidden md:inline">Messages</span>
          </Link>
        </SignedIn>
      </div>

      <div className="flex-1 rounded-lg bg-zinc-900 z-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center text-white">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Your Library</span>
          </div>
        </div>
        <Tabs defaultValue="playlists" className="space-y-4 px-2">
          <TabsList className="p-1 bg-zinc-800/50">
            <TabsTrigger
              value="playlists"
              className="data-[state=active]:bg-zinc-700"
            >
              <Music className="mr-2 size-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-zinc-700"
            >
              <Album className="mr-2 size-4" />
              Albums
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            <SignedIn>
              {/* Nút tạo playlist */}
              <div className="px-2 mb-2">
                <button
                  onClick={() => setNewPlaylistModalOpen(true)}
                  className="w-full text-sm font-semibold px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
                >
                  + Create Playlist
                </button>
              </div>

              <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide pb-24">
                <div className="space-y-2">
                  {isLoading ? (
                    <PlaylistSkeleton />
                  ) : playlists.length > 0 ? (
                    playlists.map((playlist) => (
                      <ContextMenu
                        key={playlist._id}
                        itemType="playlist"
                        itemId={playlist._id}
                        itemTitle={playlist.title}
                      >
                        <Link
                          to={`/playlists/${playlist._id}`}
                          className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                        >
                          <img
                            src={
                              playlist.imageUrl || "/cover-images/default.jpg"
                            }
                            alt="Playlist img"
                            className="size-12 rounded-md flex-shrink-0 object-cover"
                          />
                          <div className="flex-1 min-w-0 hidden md:block">
                            <p className="font-medium truncate">
                              {playlist.title}
                            </p>
                            <p className="text-sm text-zinc-400 truncate">
                              Playlist •{" "}
                              {(playlist.creator as any)?.fullName || "You"}
                            </p>
                          </div>
                        </Link>
                      </ContextMenu>
                    ))
                  ) : (
                    <p className="text-zinc-400 text-sm">No playlists yet.</p>
                  )}
                </div>
              </ScrollArea>
            </SignedIn>
            {!isSignedIn && (
              <p className="text-zinc-400 text-sm px-2">
                Sign in to view your playlists.
              </p>
            )}

            {/* Modal tạo playlist */}
            <NewPlaylistModal
              open={newPlaylistModalOpen}
              onClose={() => setNewPlaylistModalOpen(false)}
              onCreate={handleCreatePlaylist}
            />
          </TabsContent>

          <TabsContent value="albums">
            <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide pb-24">
              <div className="space-y-2">
                {isLoading ? (
                  <PlaylistSkeleton />
                ) : allAlbums.length > 0 ? (
                  allAlbums.map((album) => (
                    <ContextMenu
                      key={album._id}
                      itemType="album"
                      itemId={album._id}
                      itemTitle={album.title}
                    >
                      <Link
                        to={`/albums/${album._id}`}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        <img
                          src={album.imageUrl}
                          alt="Album img"
                          className="size-12 rounded-md flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0 hidden md:block">
                          <p className="font-medium truncate">{album.title}</p>
                          <p className="text-sm text-zinc-400 truncate">
                            Album • {album.artist}
                          </p>
                        </div>
                      </Link>
                    </ContextMenu>
                  ))
                ) : (
                  <p className="text-zinc-400 text-sm">No albums available.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeftSidebar;
