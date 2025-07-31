import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Navbar component that displays navigation links in a dropdown menu.
 * Absolutely preserves the logo and all other original navbar styling/logic.
 * Only navigation links (Home, Settings, Profile/User) are in dropdown.
 */
function Navbar({
  isAuthenticated,
  onSignout,
  onDemoLogin,
  theme,
  onThemeToggle,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Logo />
      </div>

      {/* Navigation links in dropdown menu ONLY - original layout fully preserved */}
      <div className="nav-center" style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <div className="dropdown-container" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            style={{ display: "flex", alignItems: "center", gap: "0.35em" }}
          >
            <MenuIcon />
            <span className="profile-caret" aria-hidden="true" style={{ fontSize: "1em" }}>▼</span>
          </button>
          {dropdownOpen && (
            <div
              className="profile-dropdown"
              role="menu"
              style={{ minWidth: 160 }}
            >
              <Link to="/" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <HomeIcon /> <span style={{ marginLeft: 8 }}>Home</span>
              </Link>
              <Link to="/settings" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <SettingsIcon /> <span style={{ marginLeft: 8 }}>Settings</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <UserAvatar size={20} /> <span style={{ marginLeft: 8 }}>Profile</span>
                  </Link>
                  <div className="profile-divider" />
                  <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); onSignout(); }}>
                    Sign out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); onDemoLogin(); }}>
                  Demo Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        {/* Theme toggle is kept as in original */}
        <button className="theme-toggle-btn" onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
/** Simple text logo (untouched!). */
function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="Home">
      <span className="logo-glyph">⚡</span>
      <span className="logo-text">Brand</span>
    </Link>
  );
}

function MenuIcon() {
  // Hamburger menu icon for dropdown trigger
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
        <rect y="4" width="24" height="2" rx="1" fill="#034ea1" />
        <rect y="11" width="24" height="2" rx="1" fill="#c5168c" />
        <rect y="18" width="24" height="2" rx="1" fill="#034ea1" />
      </svg>
    </span>
  );
}

function HomeIcon() {
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M7 19V12H15V19M5 10L11 4L17 10V17C17 18.1 16.1 19 15 19H7C5.9 19 5 18.1 5 17V10Z" stroke="#034ea1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function SettingsIcon() {
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="#c5168c" strokeWidth="2" />
        <path d="M19 11C19 11.8261 18.9137 12.6461 18.7434 13.4385L20.4142 14.9669L19.0787 17.1213L16.8921 16.3063C16.0882 16.8009 15.2197 17.1872 14.3063 17.4472L13.5811 19.8762H10.4189L9.69369 17.4472C8.78027 17.1872 7.91176 16.8009 7.10789 16.3063L4.92132 17.1213L3.58579 14.9669L5.25661 13.4385C5.08628 12.6461 5 11.8261 5 11C5 10.1739 5.08628 9.35391 5.25661 8.56152L3.58579 7.03314L4.92132 4.87868L7.10789 5.69365C7.91176 5.19913 8.78027 4.81278 9.69369 4.55279L10.4189 2.12377H13.5811L14.3063 4.55279C15.2197 4.81278 16.0882 5.19913 16.8921 5.69365L19.0787 4.87868L20.4142 7.03314L18.7434 8.56152C18.9137 9.35391 19 10.1739 19 11Z" stroke="#c5168c" strokeWidth="2" />
      </svg>
    </span>
  );
}

function UserAvatar({ size = 18 }) {
  return (
    <span className="user-avatar" style={{ width: size, height: size, display: "inline-block", verticalAlign: "middle" }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="18" fill="#034ea1" />
        <ellipse cx="18" cy="15" rx="7" ry="7.5" fill="#fff" />
        <ellipse cx="18" cy="30" rx="12" ry="7" fill="#fff" />
      </svg>
    </span>
  );
}

export default Navbar;
