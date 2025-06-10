import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import PendingSongsTable from "./PendingSongsTable";

const PendingSongsTabContent = () => {
  const { fetchPendingSongs } = useMusicStore();

  useEffect(() => {
    fetchPendingSongs();
  }, [fetchPendingSongs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="size-5 text-yellow-400" />
          Pending Songs
        </CardTitle>
        <CardDescription>Review submitted songs for approval</CardDescription>
      </CardHeader>
      <CardContent>
        <PendingSongsTable />
      </CardContent>
    </Card>
  );
};

export default PendingSongsTabContent;
