import { Outlet, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, GraduationCap, Briefcase, 
  Grid, Settings, Search, Bell, Users, MessageSquare, 
  Layers, Award, MessageCircle, Flame, FileCheck, 
  Kanban, Receipt, LifeBuoy, Folder, Video
} from 'lucide-react';
import logoImg from '../assets/edizo_logo.png';
import nameImg from '../assets/edizo-name.png';

const sidebarGroups = [
  {
    title: 'Executive',
    items: [
      { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    ]
  },
  {
    title: 'Sales & Client Deals',
    items: [
      { id: 'crm', path: '/crm', icon: Flame, label: 'CRM Deals Pipeline' },
      { id: 'proposals', path: '/proposals', icon: FileCheck, label: 'Proposals & E-Sign' },
      { id: 'consultations', path: '/consultations', icon: Video, label: 'Consultations' },
      { id: 'requests', path: '/requests', icon: FileText, label: 'Service Requests' },
      { id: 'messages', path: '/messages', icon: MessageSquare, label: 'General Inbox' },
    ]
  },
  {
    title: 'Project Delivery & Support',
    items: [
      { id: 'projects', path: '/projects', icon: Kanban, label: 'Agile Task Board' },
      { id: 'tickets', path: '/tickets', icon: LifeBuoy, label: 'Support Desk' },
      { id: 'documents', path: '/documents', icon: Folder, label: 'Document Center' },
    ]
  },
  {
    title: 'Finance & Invoicing',
    items: [
      { id: 'billing', path: '/billing', icon: Receipt, label: 'GST Invoices' },
    ]
  },
  {
    title: 'Talent & HR',
    items: [
      { id: 'employees', path: '/employees', icon: Briefcase, label: 'HR & Employees' },
      { id: 'internships', path: '/internships', icon: GraduationCap, label: 'Internships' },
      { id: 'internship-tasks', path: '/internship-tasks', icon: Award, label: 'Internship Tasks' },
      { id: 'applications', path: '/applications', icon: FileText, label: 'Applications' },
    ]
  },
  {
    title: 'Website & CMS',
    items: [
      { id: 'services', path: '/services', icon: Layers, label: 'Services Manager' },
      { id: 'portfolio', path: '/portfolio', icon: Layers, label: 'Portfolio' },
      { id: 'team', path: '/team', icon: Users, label: 'Team Members' },
    ]
  },
  {
    title: 'System & Bot',
    items: [
      { id: 'users', path: '/users', icon: Users, label: 'Users & Roles' },
      { id: 'whatsapp', path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Bot' },
      { id: 'settings', path: '/settings', icon: Settings, label: 'Site Settings' },
    ]
  }
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.role_id === 1 || user.role_id === 2);
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const topBarContent = (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads, projects, invoices, or team members..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/20 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-4">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-gray-600"><Grid size={20} /></button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-orange/20 text-orange flex items-center justify-center font-bold text-sm">
            {(user.name ? user.name[0] : 'A').toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{user.name || 'Admin User'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col flex-shrink-0 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-2">
          <img src={logoImg} alt="Edizo Admin" className="h-8 w-auto object-contain" />
          <img src={nameImg} alt="Edizo" className="h-5 w-auto object-contain mt-1" />
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
               <p className="px-4 text-[10px] font-bold text-gray-400 tracking-widest mb-2.5 uppercase">
                 {group.title}
               </p>
               <nav className="space-y-0.5">
                 {group.items.map(item => {
                   const isActive = location.pathname.startsWith(item.path);
                   return (
                    <NavLink 
                      key={item.id}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive 
                        ? 'bg-orange/10 text-orange font-bold shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-orange' : 'text-gray-400'} /> {item.label}
                    </NavLink>
                   );
                 })}
               </nav>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm mb-3">
            <div className="w-9 h-9 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-sm">
              {(user.name ? user.name[0] : 'A').toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">{user.name || 'Admin User'}</p>
              <p className="text-[11px] text-gray-500 truncate capitalize">{user.role?.replace('_', ' ') || 'Administrator'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full py-1.5 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {topBarContent}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
