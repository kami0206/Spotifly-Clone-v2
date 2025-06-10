import { create } from "zustand";

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
  songId: string | null;
  items: ContextMenuItem[];
  playlists?: Playlist[];
  onAddToPlaylist?: (playlistTitle: string) => void;
  onCreateNewPlaylist?: (title: string) => void;
  setContextMenu: (
    visible: boolean,
    x: number,
    y: number,
    songId: string | null,
    items: ContextMenuItem[],
    playlists?: Playlist[],
    onAddToPlaylist?: (playlistTitle: string) => void,
    onCreateNewPlaylist?: (title: string) => void
  ) => void;
  closeContextMenu: () => void;
};

interface Playlist {
  title: string;
}

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  showPlaylistDropdown?: boolean;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  visible: false,
  x: 0,
  y: 0,
  songId: null,
  items: [],
  playlists: [],
  onAddToPlaylist: () => {},
  onCreateNewPlaylist: () => {},
  setContextMenu: (
    visible,
    x,
    y,
    songId,
    items,
    playlists,
    onAddToPlaylist,
    onCreateNewPlaylist
  ) =>
    set({
      visible,
      x,
      y,
      songId,
      items,
      playlists: playlists || [],
      onAddToPlaylist: onAddToPlaylist || (() => {}),
      onCreateNewPlaylist: onCreateNewPlaylist || (() => {}),
    }),
  closeContextMenu: () =>
    set({ visible: false, x: 0, y: 0, songId: null, items: [] }),
}));
