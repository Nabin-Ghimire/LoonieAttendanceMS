import { Users, MapPin, Menu, ChevronLeft, CheckCircle, BarChart2 } from 'lucide-react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { userAuthStore } from '../store.js'
import { useState } from 'react'
import ProfileModal from '../components/ProfileModal.jsx'
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api.js';



const getSidebarItems = (role) => {
  // Normalize role to avoid casing mismatches from the backend
  role = (role || '').toString().toLowerCase();
  // Items for all roles except Offices for employees
  const items = [
    {
      key: 'attendance',
      to: '/attendance',
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Attendance',
    },
    {
      key: 'reports',
      to: '/reports',
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Reports',
    },
  ];
  if (role === 'employee') {
    return items;
  }
  if (role === 'manager') {
    // Managers see all employee items, plus Employees list and Offices
    return [
      ...items,
      {
        key: 'users',
        to: '/users',
        icon: <Users className="w-5 h-5" />,
        label: 'Employees',
      },

    ];
  }
  if (role === 'admin') {
    // Admins see everything, plus settings and Offices
    return [
      ...items,
      {
        key: 'users',
        to: '/users',
        icon: <Users className="w-5 h-5" />,
        label: 'Employees',
      },
      {
        key: 'offices',
        to: '/offices',
        icon: <MapPin className="w-5 h-5" />,
        label: 'Offices',
      }

    ];
  }
  return items;
};


const Dashboard = () => {

  const { logout: logoutFromStore } = userAuthStore.getState();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
      return;
    }
  })
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const user = userAuthStore((s) => s.user);


  // Remove useEffect for navigation; use conditional rendering below
  const location = useLocation();
  const getPageTitle = (pathname) => {
    if (!pathname || pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/attendance')) return 'Attendance';
    if (pathname.startsWith('/users')) return 'Employees';
    if (pathname.startsWith('/reports')) return 'Reports';
    return 'Dashboard';
  };
  const pageTitle = getPageTitle(location.pathname);


  // If user is explicitly null (not authenticated) redirect to login
  if (user === null) {
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace />;
  }





  return (

    // Layout: collapsible sidebar + main content
    <div className="flex min-h-screen">
      <aside className={`bg-base-200 border-r transition-all duration-200 ${isDrawerOpen ? 'w-64' : 'w-20'}`}>
        {/* Brand */}
        <NavLink to="/" className="w-full">
          <div className="w-full p-4 border-b border-base-300 flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-md bg-[#38487c] flex items-center justify-center text-white">L</div>

            <div className={`${isDrawerOpen ? 'flex flex-col' : 'hidden'}`}>
              <div className="font-semibold text-white">Loonie Attendance</div>
              <div className="text-xs text-base-content/60">{user?.role} Portal</div>
            </div>
          </div>
        </NavLink>

        {/* Sidebar items */}
        <nav className="p-2">
          <ul className="space-y-1">
            {getSidebarItems(user?.role).map(item => (
              <li key={item.key}>
                <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 w-full text-left transition rounded text-white ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}>
                  {item.icon}
                  <span className={`${isDrawerOpen ? 'inline' : 'hidden'}`}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="navbar w-full bg-base-200 px-4">
          <div className="flex items-center gap-4">
            <button title={isDrawerOpen ? 'Collapse sidebar' : 'Expand sidebar'} onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="btn btn-ghost btn-square">
              {isDrawerOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-lg font-medium text-white">{pageTitle}</div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-offset-2 ring-offset-base-100 ring-primary">
                <div className="w-10 rounded-full overflow-hidden">
                  <img alt="User avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <button onClick={() => setShowProfile(true)} className="justify-between text-left w-full">Profile</button>
                </li>
                <li>
                  <button onClick={() => { logoutMutate(); navigate('/auth/login'); }}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 content-area min-h-screen w-full"> <Outlet /></div>
        {showProfile && <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />}
      </main>
    </div>
  );
};

export default Dashboard;

