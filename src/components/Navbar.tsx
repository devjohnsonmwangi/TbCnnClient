import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiDownload } from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";
import { usePWAInstall } from "../hooks/usePWAInstall";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { isInstallable, handleInstallClick } = usePWAInstall();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/patient-intake");
    } else {
      navigate("/login");
    }
  };

  const handleNavClick = (href: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a hash link on the current page
    if (href.startsWith("/#")) {
      if (e) {
        e.preventDefault();
      }
      const sectionId = href.substring(2); // Remove #/ prefix
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll with offset for navbar
        const navHeight = 64; // navbar height in pixels
        const elementPosition = element.offsetTop - navHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    } else if (href === "/") {
      // Scroll to top when clicking Home
      if (e) {
        e.preventDefault();
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "TB Education", href: "/#education" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-150"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Sleek Design */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-base sm:text-lg leading-none">EA</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:inline-block group-hover:text-green-600 transition-colors duration-300">
              E-Afya
            </span>
          </Link>

          {/* Desktop Navigation - Clean and Minimal */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className="px-4 py-2 text-gray-700 text-sm font-medium hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-250"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Actions and User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install Button - Sleek */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-md hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
                title="Install E-Afya app"
              >
               
                <FiDownload size={16} />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {isLoggedIn ? (
              <>
                {/* User Menu - Desktop */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-250 group"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-400 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate hidden sm:inline">{user?.firstName}</span>
                   
                    <FiChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu - Modern */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{user?.email}</p>
                      </div>
                      <Link
                        to={user?.role === "ADMIN" ? "/admin-dashboard" : "/physician-dashboard"}
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 font-medium"
                      >
                        📊 Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-200 border-t border-gray-100 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* User Menu - Mobile */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="md:hidden w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm hover:shadow-md transition-shadow"
                  title={user?.firstName}
                >
                  {user?.firstName?.charAt(0).toUpperCase()}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors duration-250 px-3 py-2 hover:bg-green-50 rounded-md"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-md hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-md transition-colors duration-250 ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Clean and Organized */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => {
                  handleNavClick(link.href, e);
                  setMobileMenuOpen(false);
                }}
                className="block px-4 py-3 text-gray-700 text-sm font-medium hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                  <Link
                    to={user?.role === "ADMIN" ? "/admin-dashboard" : "/physician-dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 text-sm font-medium hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-200"
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 text-sm font-medium hover:bg-red-50/50 rounded-md transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 text-sm font-medium hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
