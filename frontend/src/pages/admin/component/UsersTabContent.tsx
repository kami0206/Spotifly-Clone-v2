import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useState } from "react";

const UsersTabContent = () => {
  const { users, fetchUsers, isLoading, error } = useChatStore();
  const { updateUserRole } = useAuthStore();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers(); // cập nhật UI sau khi update
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-800 text-sm">
            <th className="p-2 border-b border-zinc-700">Image</th>
            <th className="p-2 border-b border-zinc-700">Name</th>
            <th className="p-2 border-b border-zinc-700">Role</th>
            <th className="p-2 border-b border-zinc-700">Can Upload</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.clerkId}
              className="border-b border-zinc-700 hover:bg-zinc-800"
            >
              <td className="p-2">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.fullName} avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                )}
              </td>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleChangeRole(user.clerkId, e.target.value)
                  }
                  disabled={updatingUserId === user.clerkId}
                  className="bg-zinc-800 text-zinc-100 p-1 rounded"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                </select>
              </td>
              <td className="p-2">{user.canUpload ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTabContent;
