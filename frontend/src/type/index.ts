export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
  status: "pending" | "approved" | "rejected";
  uploadedBy: string | User;
  createdAt?: string; // Add this, optional if not always present
  updatedAt?: string; // Optional: add if API returns it
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
  email: string;
  role: "user" | "admin" | "moderator";
  canUpload: boolean; // New field
  createdAt?: string; // Add this
}

export interface Playlist {
  _id: string;
  title: string;
  imageUrl?: string;
  creator: string | { _id: string; fullName: string };
  songs: Song[];
  description?: string;
}
export interface UserStats {
  userId: string;
  songs: {
    total: number;
    statusBreakdown: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
  albums: {
    total: number;
    statusBreakdown: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}
