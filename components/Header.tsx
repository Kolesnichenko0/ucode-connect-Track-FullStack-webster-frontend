'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface Template {
  id: number;
  title: string;
  category: string;
  thumbnailUrl: string;
  isPremium: boolean;
}

export default function Header() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const { isDarkMode, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!user;

  const navigateToTemplate = (templateId: number) => {
    router.push(`/templates/${templateId}`);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    router.push('/login');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, refreshUser]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo and primary navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute top-0 left-0 h-8 w-8 bg-black dark:bg-white rounded-lg transform rotate-45 opacity-80"></div>
                <div className="absolute top-0 left-0 h-8 w-8 bg-white dark:bg-black rounded-lg transform rotate-12 opacity-80"></div>
                <div className="absolute top-0 left-0 h-8 w-8 bg-gray-800 dark:bg-gray-200 rounded-lg opacity-80"></div>
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
                GraphiCraft
              </span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {/* User Menu (when authenticated) */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none group"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">{getInitials(user.firstName, user.lastName)}</span>
                    )}
                  </div>
                  <p className="ml-2 font-medium text-gray-900 dark:text-white text-sm">{user.firstName} {user.lastName}</p>

                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                          {user.profilePictureUrl ? (
                            <img
                              src={user.profilePictureUrl}
                              alt={user.firstName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">{getInitials(user.firstName, user.lastName)}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{user.firstName} {user.lastName}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" onClick={() => setIsDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <Link href="/projects" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" onClick={() => setIsDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        My Projects
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="16 17 21 12 16 7" />
                          <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm rounded-lg border text-gray-700 px-4 py-2 dark:text-gray-200 hover:text-black dark:hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white dark:bg-gray-900 shadow-lg overflow-y-auto transition transform">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="relative h-8 w-8">
                  <div className="absolute top-0 left-0 h-8 w-8 bg-black dark:bg-white rounded-lg transform rotate-45 opacity-80"></div>
                  <div className="absolute top-0 left-0 h-8 w-8 bg-white dark:bg-black rounded-lg transform rotate-12 opacity-80"></div>
                  <div className="absolute top-0 left-0 h-8 w-8 bg-gray-800 dark:bg-gray-200 rounded-lg opacity-80"></div>
                </div>
                <span className="text-lg font-bold text-black dark:text-white">
                  GraphiCraft
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isAuthenticated && user && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">{getInitials(user.firstName, user.lastName)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{user.firstName} {user.lastName}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <span>Switch to {isDarkMode ? 'light' : 'dark'} mode</span>
                <ThemeToggle />
              </button>
            </div>

            <nav className="p-2 space-y-1">
              {isAuthenticated && (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>

                  <Link
                    href="/projects"
                    className="block px-3 py-2 rounded-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    My Projects
                  </Link>
                </>
              )}




              {!isAuthenticated && (
                <>

                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {isAuthenticated && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 p-4">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="16 17 21 12 16 7" />
                    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}