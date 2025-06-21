import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const usersRes = await axios.get('/api/admin/users');
        const uploadsRes = await axios.get('/api/admin/uploads');
        setUsers(usersRes.data.users);
        setUploads(uploadsRes.data.uploads);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch admin data');
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleBlockUser = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/block`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, blocked: true } : user
        )
      );
    } catch (err) {
      alert('Failed to block user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Username</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Email</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Role</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Blocked</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.role}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.blocked ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 space-x-2">
                  {!user.blocked && (
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Block
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upload Stats</h2>
        <p>Total uploads: {uploads.length}</p>
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 mt-4">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Filename</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">User</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{upload.filename}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{upload.userId?.username || 'N/A'}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{new Date(upload.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPage;
