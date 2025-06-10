import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library } from "lucide-react";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import PendingAlbumsTable from "./PendingAlbumsTable";

const PendingAlbumsTabContent = () => {
  const { fetchPendingAlbums, isLoading, error } = useMusicStore();

  useEffect(() => {
    fetchPendingAlbums();
  }, [fetchPendingAlbums]);

  if (isLoading) {
    return (
      <div className="text-center text-zinc-400 py-6">Loading albums...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-6">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="size-5 text-yellow-400" />
          Pending Albums
        </CardTitle>
        <CardDescription>Review submitted albums for approval</CardDescription>
      </CardHeader>
      <CardContent>
        <PendingAlbumsTable />
      </CardContent>
    </Card>
  );
};

export default PendingAlbumsTabContent;
