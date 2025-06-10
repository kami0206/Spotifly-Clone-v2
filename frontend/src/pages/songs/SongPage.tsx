import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const SongPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    songs,
    currentAlbum,
    currentSongInfo,
    fetchSongs,
    fetchSongById,
    isLoading,
    error,
  } = useMusicStore();

  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (id) fetchSongById(id);
  }, [id, fetchSongById]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (currentSong && currentSong._id !== id) {
      navigate(`/songs/${currentSong._id}`, { replace: true });
    }
  }, [currentSong, id, navigate]);

  if (isLoading) return <div>Đang tải bài hát...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  // const song =
  //   currentSong && currentSong._id === id ? currentSong : currentSongInfo;
  const song = currentSongInfo;
  if (!song) return <div>Không tìm thấy bài hát</div>;

  const handlePlayPause = () => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      const index = songs.findIndex((s) => s._id === song._id);
      playAlbum(songs, index);
      navigate(`/songs/${song._id}`);
    }
  };

  // Hàm format năm phát hành
  const getReleaseYear = (createdAt: string | undefined) => {
    if (!createdAt) return "Unknown";
    const date = new Date(createdAt);
    return date instanceof Date && !isNaN(date.getTime())
      ? date.getFullYear()
      : "Unknown";
  };
  console.log("song.duration:", song.duration, typeof song.duration);
  console.log("song.createdAt:", song.createdAt, typeof song.createdAt);
  return (
    <div className="h-full bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 p-6 text-white">
      <div className="flex gap-6 items-center max-w-4xl mx-auto">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-[240px] h-[240px] rounded-md shadow-lg"
        />
        <div>
          <p className="uppercase text-sm font-semibold mb-1">Bài hát</p>
          <h1 className="text-6xl font-extrabold leading-tight">
            {song.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-blue-300">
            <span className="flex items-center gap-1">{song.artist}</span>
            <span>• {currentAlbum?.title || "Unknown Album"}</span>
            <span>• {getReleaseYear(song.createdAt)}</span>
            <span>• {formatDuration(song.duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={handlePlayPause}
              size="icon"
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                hover:scale-105 transition-all"
            >
              {isPlaying && currentSong?._id === song._id ? (
                <Pause className="w-8 h-8 text-black" />
              ) : (
                <Play className="w-8 h-8 text-black" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPage;
