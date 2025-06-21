import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role user

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password, role })).then((res) => {
      if (!res.error) {
        // After successful registration, redirect to login page
        navigate('/login');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-gray-900">
      <h2 className="text-4xl font-extrabold mb-8 text-center">Register</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <label className="block mb-4">
        Username
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-3 mt-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        Email
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-3 mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        Password
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-3 mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="block mb-6">
        Role
        <select
          className="w-full border border-gray-300 rounded px-3 py-3 mt-1"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
