import { axiosInstance } from '../lib/axios';

export const fetchSongs = async () => {
  try {
    const response = await axiosInstance.get("/songs");
    console.log("API Response:", response.data); // Log phản hồi
    return response.data;
  } catch (error: any) {
    console.error("Error fetching songs:", error.response?.data || error.message);
    throw error;
  }
};