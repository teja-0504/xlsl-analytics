import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUploadHistory } from '../store/uploadSlice';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { uploads, loading, error } = useSelector((state) => state.upload);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUploadHistory());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload History</h1>
      {loading && <p>Loading uploads...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && uploads.length === 0 && <p>No uploads found.</p>}
      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Filename</th>
            {user && user.role === 'admin' && (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Username</th>
            )}
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Uploaded At</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Summary</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr key={upload._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{upload.filename}</td>
              {user && user.role === 'admin' && (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{upload.userId?.username || 'N/A'}</td>
              )}
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{new Date(upload.createdAt).toLocaleString()}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{upload.summary || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
