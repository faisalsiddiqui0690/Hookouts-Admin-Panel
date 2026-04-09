import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLucideIcons } from '../hooks/useLucideIcons';
import { authService } from '../services/authService';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-link d-flex button-sm-hover button-toggle-menu"
      aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        position: 'relative'
      }}
    >
      <div style={{
        width: '24px',
        height: '18px',
        position: 'relative',
        transform: 'rotate(0deg)',
        transition: '.5s ease-in-out'
      }}>
        {/* Top bar */}
        <span style={{
          display: 'block',
          position: 'absolute',
          height: '3px',
          width: '100%',
          background: 'currentColor',
          borderRadius: '3px',
          opacity: '1',
          left: '0',
          top: '0',
          transform: 'rotate(0deg)',
          transition: '.25s ease-in-out'
        }} />
        
        {/* Middle bar */}
        <span style={{
          display: 'block',
          position: 'absolute',
          height: '3px',
          width: '100%',
          background: 'currentColor',
          borderRadius: '3px',
          opacity: '1',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          transition: '.25s ease-in-out'
        }} />
        
        {/* Bottom bar */}
        <span style={{
          display: 'block',
          position: 'absolute',
          height: '3px',
          width: '100%',
          background: 'currentColor',
          borderRadius: '3px',
          left: '0',
          bottom: '0',
          transform: 'rotate(0deg)',
          transition: '.25s ease-in-out'
        }} />
      </div>
    </button>
  );
};

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: {
    text: string;
    color: string;
  };
  subItems?: Omit<MenuItem, 'subItems' | 'badge'>[];
  allowedRoles?: string[]; // Roles that can access this menu item
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'house',
    path: '/dashboard',
    badge: { text: '9+', color: 'bg-success' },
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'users',
    path: '/users',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    id: 'likes',
    label: 'Likes',
    icon: 'heart',
    path: '/likes',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'message-square',
    path: '/messages',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    id: 'online-users',
    label: 'Online',
    icon: 'activity',
    path: '/online-users',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'user',
    path: '/profile',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Sidebar = ({ isSidebarOpen, onToggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get user role on component mount
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  // Initialize icons on component mount and route change
  useLucideIcons();

  // Re-initialize icons when sidebar state changes
  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [isSidebarOpen]);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true; // Show if no role restrictions
    }
    return userRole && item.allowedRoles.includes(userRole);
  });

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar from', isSidebarOpen, 'to', !isSidebarOpen);
    onToggleSidebar();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`main-nav ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{
        width: isSidebarOpen ? '240px' : '70px',
        transition: 'width 0.3s ease-in-out',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <div className="d-flex justify-content-between align-items-center main-logo-box" style={{ padding: '1rem 0.5rem' }}>
        {/* Logo - Only show when sidebar is open */}
        {isSidebarOpen && (
          <div className="logo-box" style={{ flex: 1, textAlign: 'center' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                letterSpacing: '-0.5px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              className="text-dark-mode-aware"
              >
                <span style={{ color: '#22b956' }}>Hook</span><span className="logo-text-color">outs</span>
              </div>
            </Link>
          </div>
        )}
        {/* Hamburger Button - Always visible */}
        <HamburgerButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
      </div>

      <div className="h-100" data-simplebar>
        <ul className="navbar-nav" id="navbar-nav">
          {filteredMenuItems.map((item) => (
            <li key={item.id} className="menu-item">
              {item.subItems ? (
                <>
                  <a
                    className={`menu-link ${openMenus.includes(item.id) ? 'active' : ''}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(item.id);
                    }}
                    role="button"
                    aria-expanded={openMenus.includes(item.id)}
                  >
                    <span className="nav-icon">
                      <i data-lucide={item.icon}></i>
                    </span>
                    <span 
                      className="nav-text"
                      style={{
                        opacity: isSidebarOpen ? 1 : 0,
                        maxWidth: isSidebarOpen ? '200px' : '0',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s ease-in-out, max-width 0.3s ease-in-out'
                      }}
                    >
                      {item.label}
                    </span>
                    <span 
                      className="menu-arrow"
                      style={{
                        opacity: isSidebarOpen ? 1 : 0,
                        display: isSidebarOpen ? 'inline-block' : 'none',
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    >
                      <i data-lucide="chevron-down"></i>
                    </span>
                  </a>
                  {openMenus.includes(item.id) && (
                    <div className="collapse show" id={`sidebar${item.id}`}>
                      <ul className="sub-menu-nav">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id} className="sub-menu-item">
                            <Link
                              className={`sub-menu-link ${isActive(subItem.path || '') ? 'active' : ''}`}
                              to={subItem.path || '#'}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  className={`menu-link ${isActive(item.path || '') ? 'active' : ''}`}
                  to={item.path || '#'}
                >
                  <span className="nav-icon">
                    <i data-lucide={item.icon}></i>
                  </span>
                  <span 
                    className="nav-text"
                    style={{
                      opacity: isSidebarOpen ? 1 : 0,
                      maxWidth: isSidebarOpen ? '200px' : '0',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.2s ease-in-out, max-width 0.3s ease-in-out'
                    }}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span 
                      className={`badge ${item.badge.color} badge-pill text-end`}
                      style={{
                        opacity: isSidebarOpen ? 1 : 0,
                        display: isSidebarOpen ? 'inline-block' : 'none',
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
