import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, GraduationCap, Briefcase, 
  Grid, Settings, FilePlus, Search, Bell
} from 'lucide-react';
import logoImg from '../assets/edizo_logo.png';
import nameImg from '../assets/edizo-name.png';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  const topBarContent = (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search applications, roles, or students..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-4">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-gray-600"><Grid size={20} /></button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <img src={`https://ui-avatars.com/api/?name=${user.name || 'Admin+User'}&background=FF7A00&color=fff`} alt="User" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-gray-700">{user.name || 'Admin User'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-2">
          <img src={logoImg} alt="Edizo Admin" className="h-8 w-auto object-contain" />
          <img src={nameImg} alt="Edizo" className="h-5 w-auto object-contain mt-1" />
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 tracking-wider mb-4 mt-2 uppercase">Menu</p>
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'applications', path: '/applications', icon: FileText, label: 'Internship Apps' },
              { id: 'requests', path: '/requests', icon: FileText, label: 'Service Requests' },
              { id: 'internships', path: '/internships', icon: GraduationCap, label: 'Internships' },
              { id: 'services', path: '/services', icon: Briefcase, label: 'Services' },
              { id: 'users', path: '/users', icon: Grid, label: 'Users' },
              { id: 'messages', path: '/messages', icon: FileText, label: 'Messages' },
              { id: 'portfolio', path: '/portfolio', icon: FilePlus, label: 'Portfolio' },
              { id: 'home-page', path: '/home-page', icon: FilePlus, label: 'Manage Homepage' },
              { id: 'about-page', path: '/about-page', icon: FilePlus, label: 'Manage About Page' },
              { id: 'contact-page', path: '/contact-page', icon: FilePlus, label: 'Manage Contact Page' },
              { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
            ].map(item => (
              <NavLink 
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                  ? 'bg-orange/10 text-orange font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} strokeWidth={2} /> {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => navigate('/internships/new')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white rounded-xl font-bold shadow-sm hover:bg-orange-dark transition-colors mb-4"
          >
            <FilePlus size={18} /> New Internship
          </button>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange/20 text-orange flex items-center justify-center font-bold text-sm">
              {(user.name ? user.name[0] : 'A').toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full mt-2 py-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {topBarContent}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
