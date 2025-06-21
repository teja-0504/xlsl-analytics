import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { logout } from '../store/authSlice';

const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const themeMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  if (!user) {
    return null; // or return minimal nav with login link if preferred
  }

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    if (themeMode === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 text-white flex justify-between items-center">
      <div className="flex space-x-8">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/upload" className="hover:underline">
          Upload
        </Link>
        <Link to="/chart" className="hover:underline">
          Charts
        </Link>
        {user.role === 'admin' && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )}
        <button
          onClick={handleToggleTheme}
          className="ml-4 px-3 py-1 bg-primary-light dark:bg-primary-dark rounded text-white hover:opacity-80 transition"
          aria-label="Toggle Theme"
        >
          {themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={toggleUserMenu}
          className="cursor-pointer px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
          aria-label="User menu"
        >
          {user.username}
        </button>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
