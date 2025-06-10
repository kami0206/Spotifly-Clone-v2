import { useEffect, useState } from "react";
import SearchHeader from "./component/SearchHeader";
import { useMusicStore } from "@/stores/useMusicStore";
import { SearchResults } from "./component/SearchResults";
import { ScrollArea } from "@/components/ui/scroll-area";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { songs, albums, searchSongs, isLoading } = useMusicStore();

  useEffect(() => {
    if (query.trim() === "") {
      return;
    }
    searchSongs(query);
  }, [query, searchSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <ScrollArea className="h-[calc(100vh-180px)] bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="p-4 sm:p-6 flex flex-col items-center min-h-full">
          <div className="w-full max-w-xl ">
            <SearchHeader onSearch={setQuery} />
          </div>
          {query ? (
            <div className="w-full max-w-6xl">
              <SearchResults
                songs={songs}
                albums={albums}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400">
              <p>Enter a search query to find songs or albums.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default SearchPage;
