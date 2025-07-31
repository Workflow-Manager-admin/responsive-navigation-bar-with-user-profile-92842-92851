import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Demo state; in real app this info would come from real auth system
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  // Responsive breakpoint (desktop vs mobile)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive effect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close profile dropdown on outside click
  const profileRef = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  // PUBLIC_INTERFACE
  const handleSignout = () => {
    setIsAuthenticated(false);
    setProfileMenuOpen(false);
    setSidebarOpen(false);
  };

  // PUBLIC_INTERFACE
  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setProfileMenuOpen(false);
    setSidebarOpen(false);
  };

  // PUBLIC_INTERFACE
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // PUBLIC_INTERFACE
  const toggleProfileMenu = () => setProfileMenuOpen((open) => !open);

  // PUBLIC_INTERFACE
  const toggleTheme = () =>
    setTheme((theme) => (theme === "light" ? "dark" : "light"));

  // Main navigation links, always shown
  const navLinks = (
    <>
      <NavLinkWithIcon to="/" label="Home" icon={<HomeIcon />} onClick={() => setSidebarOpen(false)} />
      <NavLinkWithIcon to="/settings" label="Settings" icon={<SettingsIcon />} onClick={() => setSidebarOpen(false)} />
    </>
  );

  return (
    <Router>
      <div className="theme-bg">
        <Navbar
          navLinks={navLinks}
          isAuthenticated={isAuthenticated}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
          profileMenuOpen={profileMenuOpen}
          onProfileMenuToggle={toggleProfileMenu}
          profileRef={profileRef}
          onSignout={handleSignout}
          onDemoLogin={handleDemoLogin}
          onThemeToggle={toggleTheme}
          theme={theme}
        />

        {/* Sidebar for mobile/condensed view */}
        {isMobile && isAuthenticated && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <div className="sidebar-links">{navLinks}</div>
            <div className="sidebar-spacer" />
            <SidebarProfile
              onSignout={handleSignout}
              onThemeToggle={toggleTheme}
              theme={theme}
            />
          </Sidebar>
        )}

        <main style={{ marginTop: "64px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// PUBLIC_INTERFACE
function Navbar({
  navLinks,
  isAuthenticated,
  isMobile,
  sidebarOpen,
  onSidebarToggle,
  profileMenuOpen,
  onProfileMenuToggle,
  profileRef,
  onSignout,
  onDemoLogin,
  onThemeToggle,
  theme
}) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Logo />
      </div>
      {!isMobile && (
        <div className="nav-center">{navLinks}</div>
      )}
      <div className="nav-right">
        {/* Always show theme toggle */}
        <button className="theme-toggle-btn" onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {isAuthenticated ? (
          <>
            {/* Sidebar toggle button for mobile only */}
            {isMobile &&
              <button
                className="sidebar-toggle-btn"
                onClick={onSidebarToggle}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <SidebarIcon open={sidebarOpen} />
              </button>
            }
            {/* Profile Dropdown */}
            <div className="profile-container" ref={profileRef}>
              <button className="profile-btn" onClick={onProfileMenuToggle} aria-haspopup="true" aria-expanded={profileMenuOpen}>
                <UserAvatar size={28} /> <span className="profile-caret" aria-hidden="true">▼</span>
              </button>
              {profileMenuOpen && (
                <div className="profile-dropdown" role="menu">
                  <Link to="/profile" className="profile-dropdown-item" onClick={onProfileMenuToggle}>Profile</Link>
                  <div className="profile-divider" />
                  <button className="profile-dropdown-item" onClick={onSignout}>Sign out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button className="login-btn" onClick={onDemoLogin}>Demo Login</button>
        )}
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function Sidebar({ open, children, onClose }) {
  return (
    <div className={`sidebar-backdrop${open ? " open" : ""}`} onClick={onClose}>
      <aside
        className={`sidebar${open ? " open" : ""}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Sidebar"
      >
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
        {children}
      </aside>
    </div>
  );
}

// Sidebar profile info and signout in mobile sidebar
function SidebarProfile({ onSignout, onThemeToggle, theme }) {
  return (
    <div className="sidebar-profile">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
        <UserAvatar size={36} />
        <div>
          <span style={{ fontWeight: "bold" }}>Demo User</span>
          <br />
          <Link to="/profile" className="profile-link" style={{ fontSize: "13px" }}>
            View Profile
          </Link>
        </div>
      </div>
      <button className="sidebar-profile-btn" onClick={onSignout}>Sign out</button>
      <button className="sidebar-profile-btn" onClick={onThemeToggle}>
        {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
      </button>
    </div>
  );
}

// NavLink with icon and accessible label
function NavLinkWithIcon({ to, label, icon, onClick }) {
  return (
    <Link to={to} className="navlink" onClick={onClick}>
      {icon}
      <span className="navlink-label">{label}</span>
    </Link>
  );
}

function Logo() {
  // Use text-based logo for minimalism; could import SVG image if desired
  return (
    <Link to="/" className="nav-logo" aria-label="Home">
      <span className="logo-glyph">⚡</span>
      <span className="logo-text">Brand</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg width="23" height="23" viewBox="0 0 22 22" fill="none">
        <path d="M7 19V12H15V19M5 10L11 4L17 10V17C17 18.1 16.1 19 15 19H7C5.9 19 5 18.1 5 17V10Z" stroke="#034ea1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function SettingsIcon() {
  return (
    <span className="nav-icon" aria-hidden="true">
      <svg width="23" height="23" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="#c5168c" strokeWidth="2" />
        <path d="M19 11C19 11.8261 18.9137 12.6461 18.7434 13.4385L20.4142 14.9669L19.0787 17.1213L16.8921 16.3063C16.0882 16.8009 15.2197 17.1872 14.3063 17.4472L13.5811 19.8762H10.4189L9.69369 17.4472C8.78027 17.1872 7.91176 16.8009 7.10789 16.3063L4.92132 17.1213L3.58579 14.9669L5.25661 13.4385C5.08628 12.6461 5 11.8261 5 11C5 10.1739 5.08628 9.35391 5.25661 8.56152L3.58579 7.03314L4.92132 4.87868L7.10789 5.69365C7.91176 5.19913 8.78027 4.81278 9.69369 4.55279L10.4189 2.12377H13.5811L14.3063 4.55279C15.2197 4.81278 16.0882 5.19913 16.8921 5.69365L19.0787 4.87868L20.4142 7.03314L18.7434 8.56152C18.9137 9.35391 19 10.1739 19 11Z" stroke="#c5168c" strokeWidth="2" />
      </svg>
    </span>
  );
}

function SidebarIcon({ open }) {
  return open ? (
    <span style={{ fontWeight: "bold", fontSize: 22 }}>&#10005;</span> // X icon
  ) : (
    <span className="nav-icon" aria-hidden="true">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect y="4" width="24" height="2" rx="1" fill="#034ea1" />
        <rect y="11" width="24" height="2" rx="1" fill="#c5168c" />
        <rect y="18" width="24" height="2" rx="1" fill="#034ea1" />
      </svg>
    </span>
  );
}

function UserAvatar({ size = 32 }) {
  return (
    <span className="user-avatar" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="18" fill="#034ea1" />
        <ellipse cx="18" cy="15" rx="7" ry="7.5" fill="#fff" />
        <ellipse cx="18" cy="30" rx="12" ry="7" fill="#fff" />
      </svg>
    </span>
  );
}

// Pages
function Home() {
  return (
    <div className="page-container">
      <h1>Home</h1>
      <p>Welcome to the Responsive Navbar Demo!</p>
    </div>
  );
}
function Settings() {
  return (
    <div className="page-container">
      <h1>Settings</h1>
      <p>Adjust your settings here.</p>
    </div>
  );
}
function Profile() {
  return (
    <div className="page-container">
      <h1>Profile</h1>
      <p>Your profile details go here.</p>
    </div>
  );
}
function NotFound() {
  return (
    <div className="page-container">
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}

export default App;
