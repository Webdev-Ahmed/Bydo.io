import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavLink from "./ui/NavLink";
import Avatar from "./ui/Avatar";
import Dropdown from "./ui/Dropdown";
import Badge from "./ui/Badge";
import { useAuthStore } from "@/store/authStore";

const Nav = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      label: "Profile",
      onClick: () => navigate("/user"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: "Settings",
      onClick: () => navigate("/settings"),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Logout",
      onClick: handleLogout,
      variant: "danger" as const,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-50/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-linear-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight group-hover:text-pink-400 transition">
              Todoz
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              <Link
                to="/todos"
                className="text-neutral-100/70 hover:text-neutral-100 transition font-medium"
              >
                Todos
              </Link>
              {isAuthenticated && (
                <>
                  <span className="text-neutral-50/10 select-none">|</span>
                  <Link
                    to="/dashboard"
                    className="text-neutral-100/70 hover:text-neutral-100 transition font-medium"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notification Badge */}
                <button className="relative p-2 text-neutral-100/70 hover:text-neutral-100 transition">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-neutral-100">
                      {user?.name}
                    </p>
                    <Badge variant="primary" size="sm">
                      Free Plan
                    </Badge>
                  </div>
                  <Dropdown
                    trigger={
                      <Avatar name={user?.name || "User"} variant="danger" />
                    }
                    items={userMenuItems}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-100/70 hover:text-neutral-100 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-50/5 mt-2 pt-4">
            <div className="space-y-3">
              <Link
                to="/todos"
                className="block text-neutral-100/70 hover:text-neutral-100 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="block text-neutral-100/70 hover:text-neutral-100 transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2">
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigate("/user");
                      setIsMenuOpen(false);
                    }}
                    className="text-left py-2 text-neutral-100/70 hover:text-neutral-100 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left py-2 text-red-400 hover:text-red-300 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
