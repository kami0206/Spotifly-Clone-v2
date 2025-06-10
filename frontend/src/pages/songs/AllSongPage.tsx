import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Play, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Định dạng thời lượng bài hát (giây -> phút:giây)
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Lấy N phần tử ngẫu nhiên từ 1 mảng
function getRandomSubset<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const AllSongPage = () => {
  const { songs, fetchSongs, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();

  const [randomSongs, setRandomSongs] = useState<typeof songs>([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (songs && songs.length > 0) {
      const randomCount = Math.floor(Math.random() * 11) + 20; // 20 đến 30 bài
      const selected = getRandomSubset(songs, randomCount);
      setRandomSongs(selected);
    }
  }, [songs]);

  if (isLoading) return null;

  const handlePlaySong = (index: number) => {
    if (!randomSongs) return;

    const songToPlay = randomSongs[index];
    if (currentSong?._id === songToPlay._id) {
      togglePlay();
    } else {
      playSong(randomSongs, index);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none" />
          <div className="relative z-10">
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                All Songs
              </h1>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {randomSongs?.map((song, index) => {
                    const isCurrent = currentSong?._id === song._id;
                    const isCurrentAndPlaying = isCurrent && isPlaying;

                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        <div className="flex items-center justify-center relative">
                          {isCurrentAndPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <>
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                              <Play className="h-4 w-4 hidden group-hover:block absolute" />
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10 rounded"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center">{song.artist}</div>

                        <div className="flex items-center gap-4">
                          <span>{formatDuration(song.duration)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation(); // tránh click vào play
                              const link = `${window.location.origin}/songs/${song._id}`;
                              navigator.clipboard.writeText(link);
                              toast.success("Đã sao chép liên kết bài hát!");
                            }}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AllSongPage;
