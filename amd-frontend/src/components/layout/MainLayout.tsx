import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Train, 
  LayoutDashboard, 
  Package, 
  Users, 
  Store,
  Wrench,
  FileSpreadsheet,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const getDisplayName = () => {
    if (user?.fullName) {
      return `Welcome ${user.fullName.split(' ')[0]}`;
    }
    return user?.email;
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Train size={24} color="var(--railway-saffron)" />
          <span>Railway AMS</span>
        </div>
        <nav className={styles.nav}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/assets" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Package size={20} />
            Assets
          </NavLink>
          <NavLink 
            to="/employees" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Users size={20} />
            Employees
          </NavLink>
          <NavLink 
            to="/vendors" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Store size={20} />
            Vendors
          </NavLink>
          <NavLink 
            to="/maintenance" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Wrench size={20} />
            Maintenance
          </NavLink>
          {user?.role !== 'VIEWER' && (
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <FileSpreadsheet size={20} />
              Reports
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* TopBar */}
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {getDisplayName()},
            </h2>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button 
              onClick={logout} 
              className="btn" 
              style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
