import { Song } from "@/type";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  isShuffling: boolean;
  isRepeating: boolean;
  playSong: (songs: Song[], index: number) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  playPlaylist: (songs: Song[], startIndex?: number) => void; // Added for PlaylistPage
  toggleRepeat: () => void;
  initializeQueue: (songs: Song[]) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isShuffling: false,
  isRepeating: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: songs[0],
      currentIndex: 0,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const { isShuffling } = get();

    const finalQueue = [...songs];
    if (isShuffling) {
      for (let i = finalQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalQueue[i], finalQueue[j]] = [finalQueue[j], finalQueue[i]];
      }
    }

    const songToPlay = finalQueue[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${songToPlay.title} by ${songToPlay.artist}`,
      });
    }

    set({
      queue: finalQueue,
      originalQueue: songs,
      currentSong: songToPlay,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  playPlaylist: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const { isShuffling } = get();

    const finalQueue = [...songs];
    let songToPlay = songs[startIndex];

    if (isShuffling) {
      // Shuffle queue
      for (let i = finalQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalQueue[i], finalQueue[j]] = [finalQueue[j], finalQueue[i]];
      }

      // Recalculate current song index in shuffled list
      const shuffledIndex = finalQueue.findIndex(
        (s) => s._id === songToPlay._id
      );
      if (shuffledIndex !== -1) {
        startIndex = shuffledIndex;
        songToPlay = finalQueue[startIndex];
      } else {
        // If not found (rare case), take the first song
        startIndex = 0;
        songToPlay = finalQueue[0];
      }
    }

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${songToPlay.title} by ${songToPlay.artist} from playlist`,
      });
    }

    set({
      queue: finalQueue,
      originalQueue: songs,
      currentSong: songToPlay,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }
    set({ isPlaying: !get().isPlaying });
  },

  playNext: () => {
    const { isRepeating, currentSong, currentIndex, queue } = get();

    // Check if queue is empty
    if (!queue || queue.length === 0) {
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
      return;
    }

    // If isRepeating is enabled, repeat current song
    if (isRepeating && currentSong) {
      set({
        currentSong: currentSong,
        currentIndex: currentIndex,
        isPlaying: true,
      });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${currentSong.title} by ${currentSong.artist}`,
        });
      }
      return;
    }

    // Move to next song
    const nextIndex = (currentIndex + 1) % queue.length; // Use modulo to loop back to start
    const nextSong = queue[nextIndex];
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
      });
    }
    set({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  toggleShuffle: () => {
    const { isShuffling, originalQueue, currentSong } = get();

    if (isShuffling) {
      const index = originalQueue.findIndex((s) => s._id === currentSong?._id);
      set({
        isShuffling: false,
        queue: originalQueue,
        currentIndex: index !== -1 ? index : 0,
      });
    } else {
      // Shuffle originalQueue
      const shuffledQueue = [...originalQueue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [
          shuffledQueue[j],
          shuffledQueue[i],
        ];
      }

      // Ensure currentSong still exists in shuffled queue
      const index = shuffledQueue.findIndex((s) => s._id === currentSong?._id);
      set({
        isShuffling: true,
        queue: shuffledQueue,
        currentIndex: index !== -1 ? index : 0,
      });
    }
  },

  toggleRepeat: () => {
    set({ isRepeating: !get().isRepeating });
  },

  playSong: (songs, index) => {
    if (songs.length === 0) return;

    const song = songs[index];
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      originalQueue: songs,
      currentSong: song,
      currentIndex: index,
      isPlaying: true,
    });
  },
}));
