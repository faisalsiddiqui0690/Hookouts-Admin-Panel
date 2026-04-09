import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { themeService } from '../services/themeService';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = authService.getStoredUser();

  // Initialize theme state on component mount
  useEffect(() => {
    setIsDarkMode(themeService.isDarkMode());
  }, []);

  const toggleDarkMode = () => {
    const newTheme = themeService.toggleTheme();
    setIsDarkMode(newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if API call fails
      navigate('/login');
    }
  };

  return (
    <header className="topbar" style={{ margin: 0, padding: 0 }}>
      <div className="container-fluid" style={{ paddingLeft: '20px', paddingRight: '20px', marginLeft: 0, marginRight: 0 }}>
        <div className="navbar-header" style={{ marginLeft: 0, paddingLeft: 0 }}>
          <div className="d-flex align-items-center gap-2" style={{ marginLeft: 0, paddingLeft: 0 }}>
            {/* App Search */}
            <form className="app-search d-none d-md-block" style={{ marginRight: 'auto', marginLeft: 0 }}>
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search dashboard..."
                  autoComplete="off"
                  id="dashboardSearch"
                />
                <i data-lucide="search" className="search-widget-icon"></i>
              </div>
            </form>
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Theme Color (Light/Dark) */}
            <div className="topbar-item">
              <button
                type="button"
                className="topbar-button fs-24"
                id="light-dark-mode"
                onClick={toggleDarkMode}
              >
                <i data-lucide="moon" className="light-mode"></i>
                <i data-lucide="sun" className="dark-mode"></i>
              </button>
            </div>

            {/* User */}
            <div className="dropdown topbar-item">
              <a
                type="button"
                className="topbar-button p-0"
                id="page-header-user-dropdown"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-haspopup="true"
                aria-expanded={showUserMenu}
              >
                <span className="d-flex align-items-center gap-2">
                  <img
                    className="rounded-circle"
                    width="32"
                    src="/assets/images/users/avatar-1.jpg"
                    alt="user-image"
                  />
                  <span className="d-lg-flex flex-column gap-1 d-none">
                    <h5 className="my-0 text-reset fs-14">{user?.email || 'Admin User'}</h5>
                  </span>
                </span>
              </a>
              {showUserMenu && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <a className="dropdown-item" href="/profile">
                    <i data-lucide="circle-user" className="fs-16 text-muted align-middle me-2"></i>
                    <span className="align-middle">My Account</span>
                  </a>
                  <a className="dropdown-item" href="/settings">
                    <i data-lucide="settings" className="fs-16 text-muted align-middle me-2"></i>
                    <span className="align-middle">Settings</span>
                  </a>
                  <div className="dropdown-divider my-1"></div>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i data-lucide="log-out" className="fs-16 text-muted align-middle me-2"></i>
                    <span className="align-middle">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
