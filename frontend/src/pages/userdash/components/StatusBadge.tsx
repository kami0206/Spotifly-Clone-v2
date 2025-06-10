import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã duyệt
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Chờ duyệt
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="secondary" className="bg-red-500/20 text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          Bị từ chối
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          Chưa xác định
        </Badge>
      );
  }
};
