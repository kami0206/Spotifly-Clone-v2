// file: lib/api/share.ts (hoặc tổ chức trong cùng file cũng được)
import { axiosInstance } from "@/lib/axios";

export const shareSong = async ({
  songId,
  receiverId,
  message,
}: {
  songId: string;
  receiverId: string;
  message: string;
}) => {
  const res = await axiosInstance.post("/share", {
    songId,
    receiverId,
    message,
  });
  return res.data;
};
