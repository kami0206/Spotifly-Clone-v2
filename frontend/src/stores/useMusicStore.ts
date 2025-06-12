import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats, Playlist, UserStats } from "@/type";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  allAlbums: Album[];
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  pendingSongs: Song[];
  pendingAlbums: Album[];
  currentSongInfo: Song | null;
  currentPlaylist: Playlist | null;
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
  fetchSongById: (id: string) => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>; // Added for PlaylistPage
  deletePlaylist: (id: string) => Promise<void>;
  createOrUpdatePlaylist: (
    formData: FormData,
    playlistId?: string
  ) => Promise<Playlist | void>;
  removeSongsFromPlaylist: (
    playlistId: string,
    songIds: string[]
  ) => Promise<void>;
  fetchAlbumsByUser: (userId: string) => Promise<void>;
  updateAlbumStatus: (
    albumId: string,
    status: "approved" | "rejected"
  ) => Promise<void>;
  fetchSongsByUser: (userId: string) => Promise<void>;
  // updateSongStatus: (
  //   songId: string,
  //   status: "approved" | "rejected"
  // ) => Promise<void>;
  userStats: UserStats | null;
  fetchUserStats: (userId: string) => Promise<void>;
  fetchPendingSongs: () => Promise<void>;
  reviewSong: (songId: string, action: "approve" | "reject") => Promise<void>;
  fetchPendingAlbums: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  allAlbums: [],
  playlists: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  currentSongInfo: null,
  currentPlaylist: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  pendingSongs: [],
  pendingAlbums: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  fetchSongById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/songs/${id}`);
      console.log("Response data from /songs/${id}:", response.data);

      if (response?.data) {
        const song = response.data;

        // ✅ Normalize duration to number
        song.duration = Number(song.duration);
        if (!Number.isFinite(song.duration)) {
          console.warn("Song missing or invalid duration:", song);
          song.duration = 0;
        }

        set({ currentSongInfo: song });

        // Check if albumId is populated
        if (
          song.albumId &&
          typeof song.albumId === "object" &&
          song.albumId._id
        ) {
          set({ currentAlbum: song.albumId });
        } else if (song.albumId && typeof song.albumId === "string") {
          const albumResponse = await axiosInstance.get(
            `/albums/${song.albumId}`
          );
          set({ currentAlbum: albumResponse?.data || null });
        } else {
          set({ currentAlbum: null });
        }
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching song by ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      if (response?.data) {
        set({ songs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/featured");
      const response = await axiosInstance.get("/songs/featured");
      if (response?.data) {
        set({ featuredSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching featured songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/made-for-you");
      const response = await axiosInstance.get("/songs/made-for-you");
      if (response?.data) {
        set({ madeForYouSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching songs for you:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/trending");
      const response = await axiosInstance.get("/songs/trending");
      if (response?.data) {
        set({ trendingSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching popular songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      if (response?.data) {
        set({ albums: response.data, allAlbums: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching album:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      if (response?.data) {
        set({ currentAlbum: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching album by ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      if (response?.data) {
        set({ playlists: response.data }); // Overwrites existing state, removing duplicates
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching playlists:", error);
      const errorMessage =
        error.response?.status === 401
          ? "Please log in to view playlist list"
          : error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlaylistById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      console.log("Playlist API Response:", response.data);

      if (response?.data) {
        const songs = response.data.songs || [];

        // Loại bỏ bài hát bị trùng ID
        const uniqueSongsMap = new Map<string, Song>();
        songs.forEach((song: Song) => {
          if (!uniqueSongsMap.has(song._id)) {
            uniqueSongsMap.set(song._id, song);
          } else {
            console.warn("Đã loại bỏ bài hát trùng ID:", song._id);
          }
        });

        const uniqueSongs = Array.from(uniqueSongsMap.values());

        set({
          currentPlaylist: {
            ...response.data,
            songs: uniqueSongs, // Dùng danh sách bài hát không trùng
          },
        });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching playlist by ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist._id !== id),
      }));
      toast.success("Deleted playlist successfully");
    } catch (error: any) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      if (response?.data) {
        set({ stats: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Deleted song successfully");
    } catch (error: any) {
      console.error("Error deleting song:", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        allAlbums: state.allAlbums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === id ? { ...song, album: null } : song
        ),
      }));
      toast.success("Deleted album successfully");
    } catch (error: any) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album");
    } finally {
      set({ isLoading: false });
    }
  },

  searchSongs: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/songs/search?query=${encodeURIComponent(query)}`
      );
      if (response?.data) {
        set({
          songs: response.data.songs || [],
          albums: response.data.albums || [],
        });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error searching songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  createOrUpdatePlaylist: async (formData: FormData, playlistId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = playlistId
        ? await axiosInstance.put(`/playlists/cr`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axiosInstance.post("/playlists/cr", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response?.data) {
        const newPlaylist = response.data as Playlist;
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p._id === newPlaylist._id ? newPlaylist : p
          ),
        }));
        // toast.success("Created/updated playlist successfully");
        return newPlaylist;
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error creating/updating playlist:", error);
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongsFromPlaylist: async (playlistId: string, songIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/playlists/${playlistId}/songs`,
        {
          songIds,
        }
      );
      if (response?.data?.playlist) {
        const updatedPlaylist = response.data.playlist;
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist._id === playlistId ? updatedPlaylist : playlist
          ),
          currentPlaylist:
            state.currentPlaylist?._id === playlistId
              ? updatedPlaylist
              : state.currentPlaylist,
        }));
        toast.success("Removed song from playlist successfully");
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error removing song from playlist:", error);
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumsByUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/user/${userId}`);
      if (response?.data) {
        set({ albums: response.data.albums || response.data }); // Handle both response formats
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching albums by user:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAlbumStatus: async (
    albumId: string,
    action: "approved" | "rejected"
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/admin/albums/${albumId}/status`,
        { action }
      );
      if (response?.data) {
        // Cập nhật lại album trong danh sách
        set((state) => ({
          albums: state.albums.map((album) =>
            album._id === albumId ? { ...album, action } : album
          ),
        }));
        toast.success(`Updated album status successfully`);
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error updating album status:", error);
      set({ error: error.response?.data?.message || error.message });
      toast.error("Error updating album status");
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSongsByUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/songs/user/${userId}`);
      console.log("fetchSongsByUser response:", response.data);

      if (response?.data?.songs) {
        set({ songs: response.data.songs });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching songs by user:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  userStats: null,

  fetchUserStats: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${userId}/stats`);
      if (response?.data) {
        set({ userStats: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/pending");
      if (response?.data) {
        set({ pendingSongs: response.data }); // <--- Sửa chỗ này
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching pending songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  reviewSong: async (songId: string, action: "approve" | "reject") => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch(`/admin/songs/${songId}/status`, { action });
      get().fetchPendingSongs();
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPendingAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums/pending"); // endpoint lấy album pending
      set({ pendingAlbums: response.data.albums, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch pending albums",
        isLoading: false,
      });
    }
  },
}));
