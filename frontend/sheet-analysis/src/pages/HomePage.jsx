import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 p-6 relative">
      <header className="w-full flex justify-end p-6 absolute top-0 right-0">
        <Link
          to="/login"
          className="border border-gray-300 rounded-full px-6 py-2 hover:bg-gray-700 text-white transition"
        >
          Login &rarr;
        </Link>
      </header>
      <main className="flex flex-col items-center text-center max-w-xl mx-auto text-white">
        <img
          src="/src/assets/react.svg"
          alt="Robot"
          className="w-24 h-24 mb-4"
        />
        <h1 className="text-4xl font-extrabold mb-2">Welcome to Excel Analytics</h1>
        <p className="text-gray-300 mb-8">
          Analyze your Excel data with powerful charts and dashboards. Get insights and make data-driven decisions quickly and easily.
        </p>
        <Link
          to="/login"
          className="border border-gray-300 rounded-full px-8 py-3 hover:bg-gray-700 transition"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
