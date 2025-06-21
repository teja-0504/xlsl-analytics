import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  if (user && user.role === 'admin') {
    // Admin view: show users' upload data/time list only
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">You can view all users' upload data and timestamps here.</p>
        <Link to="/history" className="text-indigo-600 underline">
          View All Uploads
        </Link>
      </div>
    );
  }

  // User view: full dashboard
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:text-indigo-400">
            Dashboard
          </Link>
          <Link to="/upload" className="hover:text-indigo-400">
            Upload Excel File
          </Link>
          <Link to="/history" className="hover:text-indigo-400">
            My History
          </Link>
          <Link to="/chart" className="hover:text-indigo-400">
            My Charts
          </Link>
          <Link to="/ai-insights" className="hover:text-indigo-400">
            AI Insights
          </Link>
          <Link to="/login" className="hover:text-indigo-400 mt-auto">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username || 'User'}</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
          <p>
            Go to the <Link to="/upload" className="text-indigo-600 underline">Upload Page</Link> to upload Excel files and generate AI summaries and charts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Link to="/history" className="p-4 bg-white rounded shadow hover:bg-indigo-50">
              📁 My History
            </Link>
            <Link to="/chart" className="p-4 bg-white rounded shadow hover:bg-indigo-50">
              🎯 My Charts
            </Link>
            <Link to="/ai-insights" className="p-4 bg-white rounded shadow hover:bg-indigo-50">
              🧠 AI Insights
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
