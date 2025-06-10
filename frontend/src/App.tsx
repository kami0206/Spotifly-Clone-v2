import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import SreachPage from "./pages/sreach/SearchPage";
import SongPage from "./pages/songs/SongPage";
import AllSongPage from "./pages/songs/AllSongPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import UserPage from "./pages/userdash/UserPage";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpFallbackRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SreachPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/songs/:id" element={<SongPage />} />
          <Route path="/songs/allsongs" element={<AllSongPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
